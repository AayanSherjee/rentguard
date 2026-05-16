const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  price: { type: Number },
  city: { type: String },
  area: { type: String },
  imageUrl: { type: String },
  trust_score: { type: Number },
  verdict: { type: String },
  flags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', scanSchema);