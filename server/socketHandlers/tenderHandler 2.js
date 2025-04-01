const tenderService = require('../services/mockTenderService');
const logger = require('../utils/logger');

module.exports = (io, socket) => {
    // Join tender dashboard
    socket.on('join-tender-dashboard', async(filters = {}) => {
        try {
            const tenders = await tenderService.getTenders(filters);
            socket.emit('tenders-data', { tenders });
        } catch (error) {
            logger.error(`Error in join-tender-dashboard: ${error.message}`);
            socket.emit('error', { message: 'Failed to fetch tender data' });
        }
    });

    // Update filters
    socket.on('update-filters', async(filters = {}) => {
        try {
            const tenders = await tenderService.getTenders(filters);
            socket.emit('tenders-data', { tenders });
        } catch (error) {
            logger.error(`Error in update-filters: ${error.message}`);
            socket.emit('error', { message: 'Failed to apply filters' });
        }
    });

    // Refresh tenders
    socket.on('refresh-tenders', async() => {
        try {
            await tenderService.syncTendersWithDatabase();
            const tenders = await tenderService.getTenders({});
            io.emit('tenders-data', { tenders });
        } catch (error) {
            logger.error(`Error in refresh-tenders: ${error.message}`);
            socket.emit('error', { message: 'Failed to refresh tender data' });
        }
    });
};