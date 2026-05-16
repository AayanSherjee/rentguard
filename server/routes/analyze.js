const express = require('express');
const router = express.Router();
const runNLP = require('../modules/nlp');
const runPriceCheck = require('../modules/priceCheck');
const runImageSearch = require('../modules/imageSearch');
const calculateTrustScore = require('../modules/trustScore');

router.post('/', async (req, res) => {
  const { text, price, city, area, imageUrl } = req.body;

  console.log('Request received:', { text: text?.slice(0, 30), price, city, area, imageUrl });

  const nlpResult = runNLP(text);
  const priceResult = runPriceCheck(price, city, area);

  console.log('Running image search with URL:', imageUrl);
  const imageResult = await runImageSearch(imageUrl);
  console.log('Image result:', imageResult);

  const trustScore = calculateTrustScore(nlpResult, priceResult, imageResult);

  res.json({
    trust_score: trustScore.total,
    verdict: trustScore.verdict,
    color: trustScore.color,
    breakdown: {
      nlp: nlpResult,
      price: priceResult,
      image: imageResult
    }
  });
});

module.exports = router;