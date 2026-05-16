const express = require('express');
const router = express.Router();
const runNLP = require('../modules/nlp');
const runPriceCheck = require('../modules/priceCheck');
const runImageSearch = require('../modules/imageSearch');
const calculateTrustScore = require('../modules/trustScore');
const Scan = require('../models/Scan');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { text, price, city, area, imageUrl } = req.body;

  const nlpResult = runNLP(text);
  const priceResult = runPriceCheck(price, city, area);
  const imageResult = await runImageSearch(imageUrl);
  const trustScore = calculateTrustScore(nlpResult, priceResult, imageResult);

  const allFlags = [...nlpResult.flags, ...priceResult.flags, ...imageResult.flags];

  const result = {
    trust_score: trustScore.total,
    verdict: trustScore.verdict,
    color: trustScore.color,
    breakdown: {
      nlp: nlpResult,
      price: priceResult,
      image: imageResult
    }
  };

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const scan = new Scan({
        userId: decoded.id,
        text, price, city, area, imageUrl,
        trust_score: trustScore.total,
        verdict: trustScore.verdict,
        flags: allFlags
      });
      await scan.save();
    } catch {}
  }

  res.json(result);
});

module.exports = router;