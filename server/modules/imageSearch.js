const axios = require('axios');

async function runImageSearch(imageUrl) {
  if (!imageUrl || imageUrl.trim() === '') {
    return { score: 70, flags: ['No image URL provided — skipping image check'] };
  }

  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_reverse_image',
        image_url: imageUrl,
        api_key: process.env.SERP_API_KEY
      }
    });

    const results = response.data.image_results || [];

    if (results.length === 0) {
      return { score: 90, flags: [] };
    }

    const domains = results.slice(0, 5).map(r => {
      try { return new URL(r.link).hostname; }
      catch { return r.link; }
    });

    if (results.length >= 5) {
      return {
        score: 10,
        flags: [`Image found on ${results.length}+ other sites — likely stolen (${domains.slice(0, 3).join(', ')})`]
      };
    } else if (results.length >= 2) {
      return {
        score: 45,
        flags: [`Image appears on ${results.length} other sites — verify authenticity`]
      };
    }

    return { score: 85, flags: [] };

  } catch (err) {
    return { score: 70, flags: ['Image search unavailable — skipped'] };
  }
}

module.exports = runImageSearch;