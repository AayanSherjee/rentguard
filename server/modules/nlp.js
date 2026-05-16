const SCAM_PHRASES = [
  'pay now', 'act fast', 'limited time', 'before someone else',
  'send deposit', 'western union', 'wire transfer', 'owner is abroad',
  'currently abroad', 'not available to show', 'god fearing',
  'urgent', 'immediately', 'only serious', 'no time wasters'
];

function runNLP(text) {
  if (!text || text.trim().length === 0) {
    return { score: 50, flags: ['No listing description provided'] };
  }

  const lower = text.toLowerCase();
  const flags = [];

  SCAM_PHRASES.forEach(phrase => {
    if (lower.includes(phrase)) {
      flags.push(`Suspicious phrase detected: "${phrase}"`);
    }
  });

  if (text.trim().split(' ').length < 30) {
    flags.push('Description is too short — missing key details');
  }

  const score = Math.max(0, 100 - (flags.length * 25));
  return { score, flags };
}

module.exports = runNLP;