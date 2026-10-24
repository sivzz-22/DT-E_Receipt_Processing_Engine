const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String },
  extractedText: { type: String },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  qrData: { type: String },
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
