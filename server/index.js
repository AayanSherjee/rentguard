const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const analyzeRoute = require('./routes/analyze');
const authRoute = require('./routes/auth');
const historyRoute = require('./routes/history');

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  isConnected = true;
  console.log('MongoDB connected');
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.log('MongoDB connection failed:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api/analyze', analyzeRoute);
app.use('/api/auth', authRoute);
app.use('/api/history', historyRoute);

app.get('/', (req, res) => {
  res.json({ message: 'RentGuard API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;