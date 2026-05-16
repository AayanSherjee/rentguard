function calculateTrustScore(nlp, price, image) {
  const weighted = (nlp.score * 0.40) + (price.score * 0.30) + (image.score * 0.30);
  const total = Math.round(weighted);

  let verdict, color;
  if (total >= 75) {
    verdict = 'Safe'; color = 'green';
  } else if (total >= 50) {
    verdict = 'Suspicious'; color = 'orange';
  } else {
    verdict = 'Likely Scam'; color = 'red';
  }

  return { total, verdict, color };
}

module.exports = calculateTrustScore;