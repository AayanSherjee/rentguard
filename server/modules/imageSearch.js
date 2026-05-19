const axios = require('axios');

const LISTING_SITES = [
  'zameen.com', 'olx.com.pk', 'graana.com', 'lamudi.pk',
  'propnow.pk', 'bayut.pk', 'jagah.com', 'bproperty.com',
  'facebook.com', 'instagram.com', 'tiktok.com', 'youtube.com',
  'twitter.com', 'x.com', 'linkedin.com', 'pinterest.com',
  'whatsapp.com', 'snapchat.com'
];

function isListingSite(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return LISTING_SITES.some(site => hostname.includes(site));
  } catch {
    return false;
  }
}

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

    const suspiciousSites = results.filter(r => !isListingSite(r.link));
    const listingSites = results.filter(r => isListingSite(r.link));

    if (suspiciousSites.length >= 5) {
      const domains = suspiciousSites.slice(0, 3).map(r => {
        try { return new URL(r.link).hostname; } catch { return r.link; }
      });
      return {
        score: 10,
        flags: [`Image found on ${suspiciousSites.length} unrelated sites — likely stolen (${domains.join(', ')})`]
      };
    } else if (suspiciousSites.length >= 2) {
      return {
        score: 45,
        flags: [`Image appears on ${suspiciousSites.length} non-listing sites — verify authenticity`]
      };
    } else if (listingSites.length > 0) {
      return {
        score: 85,
        flags: [`Image found on ${listingSites.length} property listing site(s) — normal for legitimate listings`]
      };
    }

    return { score: 90, flags: [] };

  } catch (err) {
    return { score: 70, flags: ['Image search unavailable — skipped'] };
  }
}

module.exports = runImageSearch;
