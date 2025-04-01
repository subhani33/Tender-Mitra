const { Server } = require('socket.io');
const eprocureIntegrationService = require('../services/eprocureIntegrationService');
const logger = require('../utils/logger');

class TenderSocket {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || 'http://localhost:5173',
                methods: ['GET', 'POST']
            }
        });

        this.setupSocketHandlers();
        this.setupIntegrationEvents();
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            logger.info('Client connected:', socket.id);

            // Handle client disconnection
            socket.on('disconnect', () => {
                logger.info('Client disconnected:', socket.id);
            });

            // Handle client requesting initial data
            socket.on('join-tender-dashboard', async(filters = {}) => {
                try {
                    const tenders = await eprocureIntegrationService.getTenders(filters);
                    const stats = await eprocureIntegrationService.getTenderStats();

                    socket.emit('tenders-data', {
                        tenders,
                        stats,
                        lastUpdated: eprocureIntegrationService.lastSyncTime
                    });

                    logger.info(`Sent initial data to client ${socket.id}`);
                } catch (error) {
                    logger.error(`Error sending initial data: ${error.message}`);
                    socket.emit('error', { message: 'Failed to fetch initial data' });
                }
            });

            // Handle filter updates
            socket.on('update-filters', async(filters = {}) => {
                try {
                    const tenders = await eprocureIntegrationService.getTenders(filters);
                    socket.emit('tenders-data', {
                        tenders,
                        lastUpdated: eprocureIntegrationService.lastSyncTime
                    });

                    logger.info(`Applied filters for client ${socket.id}`);
                } catch (error) {
                    logger.error(`Error applying filters: ${error.message}`);
                    socket.emit('error', { message: 'Failed to apply filters' });
                }
            });

            // Handle refresh request
            socket.on('refresh-tenders', async() => {
                try {
                    socket.emit('sync-status', { status: 'syncing', message: 'Synchronizing tender data...' });

                    const success = await eprocureIntegrationService.refreshTenders();

                    if (success) {
                        const tenders = await eprocureIntegrationService.getTenders({});
                        const stats = await eprocureIntegrationService.getTenderStats();

                        socket.emit('tenders-data', {
                            tenders,
                            stats,
                            lastUpdated: eprocureIntegrationService.lastSyncTime
                        });

                        socket.emit('sync-status', {
                            status: 'completed',
                            message: 'Tender data synchronized successfully',
                            timestamp: eprocureIntegrationService.lastSyncTime
                        });

                        logger.info(`Manual refresh completed for client ${socket.id}`);
                    } else {
                        socket.emit('sync-status', {
                            status: 'failed',
                            message: 'Failed to synchronize tender data'
                        });
                    }
                } catch (error) {
                    logger.error(`Error in manual refresh: ${error.message}`);
                    socket.emit('error', { message: 'Failed to refresh tender data' });
                    socket.emit('sync-status', {
                        status: 'failed',
                        message: 'Failed to synchronize tender data: ' + error.message
                    });
                }
            });
        });
    }

    setupIntegrationEvents() {
        // Listen for integration service events
        eprocureIntegrationService.on('syncStarted', () => {
            this.io.emit('sync-status', {
                status: 'syncing',
                message: 'Synchronizing tender data...'
            });

            logger.info('Broadcasting sync started event');
        });

        eprocureIntegrationService.on('syncCompleted', async(data) => {
            try {
                const tenders = await eprocureIntegrationService.getTenders({});
                const stats = await eprocureIntegrationService.getTenderStats();

                this.io.emit('tenders-data', {
                    tenders,
                    stats,
                    lastUpdated: data.timestamp
                });

                this.io.emit('sync-status', {
                    status: 'completed',
                    message: `Synchronized ${data.count} tenders`,
                    timestamp: data.timestamp
                });

                logger.info(`Broadcasting sync completed with ${data.count} tenders`);
            } catch (error) {
                logger.error(`Error broadcasting sync completion: ${error.message}`);
            }
        });

        eprocureIntegrationService.on('syncFailed', (data) => {
            this.io.emit('sync-status', {
                status: 'failed',
                message: `Synchronization failed: ${data.error}`,
                timestamp: data.timestamp
            });

            logger.error(`Broadcasting sync failed: ${data.error}`);
        });
    }

    // Method to emit updates to all connected clients
    emitUpdate(data) {
        this.io.emit('tenderUpdate', data);
    }

    // Method to emit errors to all connected clients
    emitError(error) {
        this.io.emit('error', error);
    }
}

module.exports = TenderSocket;