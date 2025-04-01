const express = require('express');
const cors = require('cors');
const app = express();

// Basic middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Mock tender data
const mockTenders = [{
        id: 1,
        title: 'Road Construction Project',
        department: 'Public Works',
        deadline: '2025-05-01',
        value: 1000000,
        status: 'active',
        description: 'Construction of 5km road with modern infrastructure',
        issuer: 'Government of India',
        category: 'Infrastructure'
    },
    {
        id: 2,
        title: 'Hospital Equipment Supply',
        department: 'Healthcare',
        deadline: '2025-06-15',
        value: 500000,
        status: 'active',
        description: 'Supply of medical equipment for new hospital wing',
        issuer: 'Ministry of Health',
        category: 'Healthcare'
    }
];

// Basic routes
app.get('/api/tenders', (req, res) => {
    res.json({
        status: 'success',
        data: { tenders: mockTenders }
    });
});

app.get('/api/tenders/:id', (req, res) => {
    const tender = mockTenders.find(t => t.id === parseInt(req.params.id));
    if (!tender) {
        return res.status(404).json({
            status: 'error',
            message: 'Tender not found'
        });
    }
    res.json({
        status: 'success',
        data: { tender }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        message: 'Service is healthy',
        timestamp: new Date().toISOString()
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});