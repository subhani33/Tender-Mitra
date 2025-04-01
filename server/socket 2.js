const socketIO = require('socket.io');
// Use mockTenderService for development and testing
// Switch to tenderService for production with real API
const tenderService = require('./services/mockTenderService');

function setupSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected to socket:', socket.id);

        // Send initial data on connection
        socket.on('join-tender-dashboard', async(filters) => {
            try {
                const tenders = await tenderService.getTenders(filters);
                socket.emit('tenders-data', tenders);
            } catch (error) {
                socket.emit('error', { message: 'Failed to fetch tender data' });
            }
        });

        // Listen for filter changes
        socket.on('update-filters', async(filters) => {
            try {
                const tenders = await tenderService.getTenders(filters);
                socket.emit('tenders-data', tenders);
            } catch (error) {
                socket.emit('error', { message: 'Failed to apply filters' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    // Set up periodic data refresh (every 15 minutes)
    setInterval(async() => {
        try {
            await tenderService.syncTendersWithDatabase();
            const latestTenders = await tenderService.getTenders({});
            io.emit('tenders-data', latestTenders);
            console.log('Tender data refreshed and broadcast to all clients');
        } catch (error) {
            console.error('Error in background sync:', error);
        }
    }, 15 * 60 * 1000); // 15 minutes

    return io;
}

module.exports = setupSocket;