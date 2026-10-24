const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Receipt = require('../models/Receipt');
const authMiddleware = require('../middleware/auth');

// Set up multer for file uploads
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

// POST /api/receipts - Save a new receipt
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { category, extractedText, qrData } = req.body;
    const file = req.file;
    if (!file || !category) return res.status(400).json({ message: 'File and category are required' });
    const receipt = new Receipt({
      user: req.user.id,
      fileName: file.originalname,
      fileUrl: file.path,
      extractedText,
      category,
      qrData,
    });
    await receipt.save();
    res.status(201).json({ message: 'Receipt saved', receipt });
  } catch (err) {
    res.status(500).json({ message: 'Error saving receipt', error: err.message });
  }
});

// GET /api/receipts - Get all receipts for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const receipts = await Receipt.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ receipts });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching receipts', error: err.message });
  }
});

module.exports = router;
