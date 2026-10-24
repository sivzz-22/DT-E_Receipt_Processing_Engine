const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get('/api', (req, res) => {
  res.send('E_Receipt backend is running');
});

const authRoutes = require('./routes/auth');
const ocrRoutes = require('./routes/ocr');
const receiptsRoutes = require('./routes/receipts');
app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/receipts', receiptsRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
