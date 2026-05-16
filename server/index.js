const express = require('express');
const cors = require('cors');
require('dotenv').config();

const analyzeRoute = require('./routes/analyze');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/analyze', analyzeRoute);

app.get('/', (req, res) => {
  res.json({ message: 'RentGuard API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});