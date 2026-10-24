const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads (store in /uploads)
const upload = multer({
  dest: path.join(__dirname, '../uploads/')
});

// POST /api/ocr/upload - upload image and extract text
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    const imagePath = req.file.path;
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    // Optionally delete the file after processing
    fs.unlink(imagePath, () => {});
    res.json({ text });
  } catch (err) {
    res.status(500).json({ message: 'OCR failed', error: err.message });
  }
});

module.exports = router;
