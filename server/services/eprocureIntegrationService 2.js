const eprocureScraper = require('./eprocureScraper');
const Tender = require('../models/Tender');
const logger = require('../utils/logger');
const cache = require('../utils/cache');
const { EventEmitter } = require('events');

class EprocureIntegrationService extends EventEmitter {
    constructor() {
        super();
        this.isSyncing = false;
        this.syncInterval = parseInt(process.env.SYNC_INTERVAL_MINUTES || '30', 10) * 60 * 1000;
        this.lastSyncTime = null;
        this.syncTimer = null;
        this.useFallbackData = process.env.USE_FALLBACK_DATA === 'true';
    }

    initialize() {
        logger.info('Initializing eprocure integration service');

        // Start periodic syncing
        this.startPeriodicSync();

        // Add shutdown handler
        process.on('SIGINT', () => {
            this.stopPeriodicSync();
            eprocureScraper.close();
        });

        return this;
    }

    startPeriodicSync() {
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
        }

        // Initial sync immediately
        this.syncTenders();

        // Schedule periodic sync
        this.syncTimer = setInterval(() => {
            this.syncTenders();
        }, this.syncInterval);

        logger.info(`Scheduled tender sync every ${this.syncInterval / 60000} minutes`);
    }

    stopPeriodicSync() {
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
            this.syncTimer = null;
            logger.info('Stopped periodic tender sync');
        }
    }

    async syncTenders() {
        if (this.isSyncing) {
            logger.info('Tender sync already in progress, skipping');
            return false;
        }

        this.isSyncing = true;
        this.emit('syncStarted');

        let tenders = [];
        let success = false;

        try {
            logger.info('Starting tender sync with eprocure.gov.in');

            // Try to get data from the actual source
            if (!this.useFallbackData) {
                try {
                    tenders = await eprocureScraper.getActiveTenders();
                    success = true;
                } catch (error) {
                    logger.error(`Failed to get data from eprocure.gov.in: ${error.message}`);
                    this.useFallbackData = true;
                }
            }

            // Fallback to mock data if needed
            if (this.useFallbackData || tenders.length === 0) {
                logger.info('Using fallback/mock tender data');
                tenders = eprocureScraper.generateMockTenders();
                success = true;
            }

            if (tenders.length > 0) {
                await this.saveTendersToDatabase(tenders);

                // Update sync status
                this.lastSyncTime = new Date();
                await cache.set('last_sync_time', this.lastSyncTime.toISOString());

                logger.info(`Successfully synced ${tenders.length} tenders`);
                this.emit('syncCompleted', { count: tenders.length, timestamp: this.lastSyncTime });
            } else {
                logger.warn('No tenders retrieved during sync');
                this.emit('syncCompleted', { count: 0, timestamp: new Date() });
            }

            return success;
        } catch (error) {
            logger.error(`Tender sync failed: ${error.message}`);
            this.emit('syncFailed', { error: error.message, timestamp: new Date() });
            return false;
        } finally {
            this.isSyncing = false;
        }
    }

    async saveTendersToDatabase(tenders) {
        try {
            logger.info(`Saving ${tenders.length} tenders to database`);

            // Process tenders in batches of 50
            const batchSize = 50;

            for (let i = 0; i < tenders.length; i += batchSize) {
                const batch = tenders.slice(i, i + batchSize);

                // Use Promise.all for parallel saving
                await Promise.all(batch.map(async(tender) => {
                    try {
                        // Try to find existing tender by reference number
                        const existingTender = await Tender.findOne({ referenceNumber: tender.referenceNumber });

                        if (existingTender) {
                            // Update existing tender
                            await Tender.findOneAndUpdate({ referenceNumber: tender.referenceNumber }, {
                                $set: {
                                    ...tender,
                                    updatedAt: new Date()
                                }
                            });
                        } else {
                            // Create new tender
                            const newTender = new Tender({
                                ...tender,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            });

                            await newTender.save();
                        }
                    } catch (err) {
                        logger.error(`Error processing tender ${tender.referenceNumber}: ${err.message}`);
                    }
                }));

                logger.debug(`Processed batch ${i / batchSize + 1} of tenders`);
            }

            // Optional: Clean up old tenders that aren't active anymore
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            await Tender.deleteMany({
                status: 'Closed',
                updatedAt: { $lt: threeMonthsAgo }
            });

            return true;
        } catch (error) {
            logger.error(`Failed to save tenders to database: ${error.message}`);
            throw error;
        }
    }

    async getTenders(filters = {}) {
        try {
            // Create MongoDB query based on filters
            let query = {};

            if (filters.status) {
                query.status = filters.status;
            }

            if (filters.department) {
                query.department = filters.department;
            }

            if (filters.searchTerm) {
                query.$or = [
                    { title: { $regex: filters.searchTerm, $options: 'i' } },
                    { referenceNumber: { $regex: filters.searchTerm, $options: 'i' } },
                    { department: { $regex: filters.searchTerm, $options: 'i' } }
                ];
            }

            if (filters.minValue) {
                query.value = { $gte: parseFloat(filters.minValue) };
            }

            if (filters.maxValue) {
                if (query.value) {
                    query.value.$lte = parseFloat(filters.maxValue);
                } else {
                    query.value = { $lte: parseFloat(filters.maxValue) };
                }
            }

            if (filters.category) {
                query.category = filters.category;
            }

            if (filters.location) {
                query.location = filters.location;
            }

            // Execute query
            return await Tender.find(query).sort({ deadline: 1 });
        } catch (error) {
            logger.error(`Error retrieving tenders: ${error.message}`);
            throw error;
        }
    }

    async refreshTenders() {
        // Force a new sync
        return await this.syncTenders();
    }

    async getTenderStats() {
        try {
            const totalCount = await Tender.countDocuments();
            const openCount = await Tender.countDocuments({ status: 'Open' });
            const closingCount = await Tender.countDocuments({ status: 'Closing Soon' });
            const closedCount = await Tender.countDocuments({ status: 'Closed' });

            // Get value sums
            const valueStats = await Tender.aggregate([{
                $group: {
                    _id: null,
                    totalValue: { $sum: '$value' },
                    avgValue: { $avg: '$value' }
                }
            }]);

            // Get department counts
            const departments = await Tender.aggregate([{
                    $group: {
                        _id: '$department',
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 5
                }
            ]);

            // Get category counts
            const categories = await Tender.aggregate([{
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 5
                }
            ]);

            return {
                counts: {
                    total: totalCount,
                    open: openCount,
                    closingSoon: closingCount,
                    closed: closedCount
                },
                values: valueStats.length > 0 ? {
                    total: valueStats[0].totalValue,
                    average: valueStats[0].avgValue
                } : {
                    total: 0,
                    average: 0
                },
                departments: departments.map(dept => ({
                    name: dept._id,
                    count: dept.count
                })),
                categories: categories.map(cat => ({
                    name: cat._id,
                    count: cat.count
                }))
            };
        } catch (error) {
            logger.error(`Error getting tender stats: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new EprocureIntegrationService();