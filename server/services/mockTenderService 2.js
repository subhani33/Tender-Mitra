const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class MockTenderService {
    constructor() {
        this.tenders = [];
        this.categories = ['Construction', 'IT Services', 'Healthcare', 'Education', 'Transportation', 'Energy', 'Defense'];
        this.departments = ['Ministry of Defense', 'Ministry of Education', 'Ministry of Health', 'Ministry of Transportation', 'Ministry of IT'];
        this.statuses = ['Open', 'Closed', 'Under Review', 'Awarded', 'Cancelled'];
        this.initialized = false;
    }

    generateMockTenders(count = 20) {
        if (this.initialized) return this.tenders;

        logger.info(`Generating ${count} mock tenders for development`);
        const tenders = [];

        for (let i = 0; i < count; i++) {
            // Create random deadline between today and next 30 days
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + Math.floor(Math.random() * 30));

            const tender = {
                id: uuidv4(),
                referenceNumber: `TENDER-${Math.floor(Math.random() * 10000)}`,
                title: `Mock Tender Project ${i + 1}`,
                department: this.departments[Math.floor(Math.random() * this.departments.length)],
                category: this.categories[Math.floor(Math.random() * this.categories.length)],
                description: `This is a mock tender for development and testing purposes.`,
                value: Math.floor(Math.random() * 1000000) + 10000,
                deadline: deadline.toISOString(),
                status: this.determineStatusByDeadline(deadline),
                location: ['New Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore'][Math.floor(Math.random() * 5)],
                publishedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            tenders.push(tender);
        }

        this.tenders = tenders;
        this.initialized = true;
        return tenders;
    }

    determineStatusByDeadline(deadline) {
        const now = new Date();

        // If deadline is in the past, randomly select Closed, Awarded, or Cancelled
        if (deadline < now) {
            const pastStatuses = ['Closed', 'Awarded', 'Cancelled'];
            return pastStatuses[Math.floor(Math.random() * pastStatuses.length)];
        }

        // If deadline is within the next 3 days
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);

        if (deadline < threeDaysFromNow) {
            return 'Closing Soon';
        }

        // Otherwise, it's open
        return 'Open';
    }

    async syncTendersWithDatabase() {
        // This would normally sync with a real database
        // For mock service, we just generate new data
        if (!this.initialized) {
            this.generateMockTenders();
        }

        return this.tenders.length;
    }

    async getTenders(filters = {}) {
        if (!this.initialized) {
            this.generateMockTenders();
        }

        let filteredTenders = [...this.tenders];

        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredTenders = filteredTenders.filter(tender =>
                tender.title.toLowerCase().includes(searchTerm) ||
                tender.description.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.status) {
            filteredTenders = filteredTenders.filter(tender =>
                tender.status === filters.status
            );
        }

        if (filters.department) {
            filteredTenders = filteredTenders.filter(tender =>
                tender.department === filters.department
            );
        }

        if (filters.category) {
            filteredTenders = filteredTenders.filter(tender =>
                tender.category === filters.category
            );
        }

        if (filters.minValue) {
            filteredTenders = filteredTenders.filter(tender =>
                tender.value >= Number(filters.minValue)
            );
        }

        if (filters.maxValue) {
            filteredTenders = filteredTenders.filter(tender =>
                tender.value <= Number(filters.maxValue)
            );
        }

        // Return filtered tenders
        return {
            status: 'success',
            results: filteredTenders.length,
            data: {
                tenders: filteredTenders
            }
        };
    }
}

module.exports = new MockTenderService();