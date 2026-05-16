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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

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