const express = require('express');
const router = express.Router();

// Mock upload routes
router.post('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'File upload endpoint is working',
        fileUrl: 'https://example.com/uploads/mock-file.pdf'
    });
});

module.exports = router;