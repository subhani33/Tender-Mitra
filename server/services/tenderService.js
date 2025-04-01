const axios = require('axios');
const Tender = require('../models/Tender');

// Configure with your actual API source
const TENDER_API_URL = process.env.TENDER_API_URL || 'https://api.tender-source.gov/tenders';
const API_KEY = process.env.TENDER_API_KEY;

class TenderService {
    async fetchLatestTenders() {
        try {
            const response = await axios.get(TENDER_API_URL, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    limit: 100,
                    status: 'active',
                    sort: 'deadline'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching tenders:', error.message);
            throw new Error('Failed to fetch tender data from source API');
        }
    }

    async syncTendersWithDatabase() {
        try {
            const tenders = await this.fetchLatestTenders();

            // Process and save each tender
            for (const tender of tenders) {
                await Tender.findOneAndUpdate({ referenceNumber: tender.referenceNumber }, {
                    title: tender.title,
                    department: tender.department,
                    value: tender.value,
                    deadline: new Date(tender.deadline),
                    status: tender.status,
                    description: tender.description,
                    location: tender.location,
                    category: tender.category,
                    documents: tender.documents
                }, { upsert: true, new: true });
            }

            return await Tender.find().sort({ deadline: 1 });
        } catch (error) {
            console.error('Error syncing tenders:', error.message);
            throw new Error('Failed to sync tender data with database');
        }
    }

    // Get tenders with filtering options
    async getTenders(filters = {}) {
        try {
            let query = {};

            if (filters.status) query.status = filters.status;
            if (filters.department) query.department = filters.department;
            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { department: { $regex: filters.search, $options: 'i' } },
                    { referenceNumber: { $regex: filters.search, $options: 'i' } }
                ];
            }

            if (filters.minValue) query.value = { $gte: parseFloat(filters.minValue) };
            if (filters.maxValue) {
                if (query.value) {
                    query.value.$lte = parseFloat(filters.maxValue);
                } else {
                    query.value = { $lte: parseFloat(filters.maxValue) };
                }
            }

            const tenders = await Tender.find(query).sort({ deadline: 1 });
            return tenders;
        } catch (error) {
            console.error('Error fetching tenders from DB:', error.message);
            throw new Error('Failed to retrieve tender data');
        }
    }
}

module.exports = new TenderService();