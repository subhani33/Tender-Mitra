const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * Simplified mock implementation of bid routes for development
 */

// Helper function to generate mock bids
const generateMockBids = (count = 5) => {
    const bids = [];
    for (let i = 0; i < count; i++) {
        const status = ['draft', 'in-progress', 'submitted', 'awarded', 'rejected'][i % 5];
        const createdDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
        const deadlineDate = new Date(createdDate);
        deadlineDate.setDate(deadlineDate.getDate() + 14);

        bids.push({
            id: `bid-${i + 1}`,
            tenderReference: `TENDER-${1000 + i}`,
            title: `Bid for Project ${i + 1}`,
            status,
            deadline: deadlineDate.toISOString(),
            value: Math.floor(Math.random() * 1000000) + 50000,
            department: ['Ministry of Defense', 'Ministry of Education', 'Ministry of Health'][i % 3],
            documents: [{
                    id: `doc-${i}-1`,
                    name: 'Technical Proposal.pdf',
                    type: 'application/pdf',
                    size: 1024 * 1024,
                    uploadDate: new Date().toISOString(),
                    status: 'approved',
                    url: '/documents/sample.pdf'
                },
                {
                    id: `doc-${i}-2`,
                    name: 'Financial Proposal.xlsx',
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    size: 512 * 1024,
                    uploadDate: new Date().toISOString(),
                    status: 'pending',
                    url: '/documents/sample.xlsx'
                }
            ],
            tasks: [{
                    id: `task-${i}-1`,
                    text: 'Review tender documents',
                    completed: true,
                    category: 'preparation',
                    dueDate: new Date(createdDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: `task-${i}-2`,
                    text: 'Prepare financial offer',
                    completed: status !== 'draft',
                    category: 'financial',
                    dueDate: new Date(createdDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: `task-${i}-3`,
                    text: 'Submit bid documents',
                    completed: ['submitted', 'awarded', 'rejected'].includes(status),
                    category: 'submission',
                    dueDate: new Date(createdDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            progress: status === 'draft' ? 30 : status === 'in-progress' ? 60 : 100,
            createdAt: createdDate.toISOString(),
            updatedAt: new Date().toISOString()
        });
    }
    return bids;
};

// Get user bids
router.get('/', (req, res) => {
    const bids = generateMockBids(8);
    res.status(200).json({
        status: 'success',
        results: bids.length,
        data: { bids }
    });
});

// Get user bid stats
router.get('/stats', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            stats: {
                drafts: 3,
                inProgress: 4,
                submitted: 5,
                awarded: 2,
                rejected: 1,
                documentsUploaded: 15,
                tasksCompleted: 20,
                totalValue: 12500000
            }
        }
    });
});

// Get single bid
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const bid = generateMockBids(1)[0];
    bid.id = id;
    res.status(200).json({
        status: 'success',
        data: { bid }
    });
});

// Create bid
router.post('/', (req, res) => {
    const newBid = {
        id: `bid-new-${Date.now()}`,
        status: 'draft',
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    res.status(201).json({
        status: 'success',
        data: { bid: newBid }
    });
});

// Update bid
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updatedBid = {
        id,
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    res.status(200).json({
        status: 'success',
        data: { bid: updatedBid }
    });
});

// Update bid status
router.patch('/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    res.status(200).json({
        status: 'success',
        data: {
            bid: {
                id,
                status: status || 'in-progress',
                updatedAt: new Date().toISOString()
            }
        }
    });
});

// Delete bid
router.delete('/:id', (req, res) => {
    res.status(204).send();
});

// Document operations
router.post('/:id/documents', (req, res) => {
    const { id } = req.params;
    const document = {
        id: `doc-${Date.now()}`,
        name: req.body.name || 'New Document.pdf',
        type: req.body.type || 'application/pdf',
        size: req.body.size || 1024 * 1024,
        uploadDate: new Date().toISOString(),
        status: 'pending',
        url: '/documents/sample.pdf'
    };

    res.status(201).json({
        status: 'success',
        data: { document }
    });
});

router.delete('/:id/documents/:documentId', (req, res) => {
    res.status(204).send();
});

// Checklist operations
router.post('/:id/checklist', (req, res) => {
    const { id } = req.params;
    const checklistItem = {
        id: `task-${Date.now()}`,
        text: req.body.text || 'New task',
        completed: false,
        category: req.body.category || 'general',
        dueDate: req.body.dueDate
    };

    res.status(201).json({
        status: 'success',
        data: { checklistItem }
    });
});

router.patch('/:id/checklist/:itemId', (req, res) => {
    const { id, itemId } = req.params;

    res.status(200).json({
        status: 'success',
        data: {
            checklistItem: {
                id: itemId,
                ...req.body,
                updatedAt: new Date().toISOString()
            }
        }
    });
});

router.delete('/:id/checklist/:itemId', (req, res) => {
    res.status(204).send();
});

// All other routes will just return success for simplicity
router.all('/*', (req, res) => {
    const urlParts = req.path.split('/');
    const lastPart = urlParts[urlParts.length - 1];

    // Try to guess what type of response the client might expect
    if (req.method === 'GET') {
        res.status(200).json({
            status: 'success',
            data: {
                [lastPart]: lastPart === 'notes' ? [{ id: 'note-1', content: 'Mock note', createdAt: new Date().toISOString() }] : { id: `${lastPart}-mock`, name: `Mock ${lastPart}` }
            }
        });
    } else if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        res.status(201).json({
            status: 'success',
            data: {
                [lastPart.endsWith('s') ? lastPart.slice(0, -1) : lastPart]: {
                    id: `${lastPart}-${Date.now()}`,
                    ...req.body,
                    createdAt: new Date().toISOString()
                }
            }
        });
    } else {
        res.status(204).send();
    }
});

module.exports = router;