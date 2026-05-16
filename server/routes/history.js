const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Scan = require('../models/Scan');

router.get('/', auth, async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(scans);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;