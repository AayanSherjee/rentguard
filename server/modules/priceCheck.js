const AVERAGE_RENTS = {
  karachi: {
    dha: 120000, clifton: 110000, gulshan: 55000,
    nazimabad: 35000, korangi: 25000, other: 40000
  },
  lahore: {
    dha: 100000, gulberg: 90000, johar: 45000, other: 40000
  },
  islamabad: {
    f7: 130000, g11: 60000, other: 55000
  }
};

function runPriceCheck(price, city, area) {
  if (!price || !city) {
    return { score: 70, flags: ['Price or city not provided — skipping price check'] };
  }

  const cityData = AVERAGE_RENTS[city.toLowerCase()];
  if (!cityData) {
    return { score: 70, flags: ['City not in database yet'] };
  }

  const areaKey = area ? area.toLowerCase() : 'other';
  const average = cityData[areaKey] || cityData['other'];
  const ratio = price / average;
  const flags = [];

  if (ratio < 0.5) {
    flags.push(`Price (PKR ${price}) is ${Math.round((1 - ratio) * 100)}% below area average — major red flag`);
    return { score: 10, flags };
  } else if (ratio < 0.7) {
    flags.push(`Price is unusually low compared to area average of PKR ${average}`);
    return { score: 45, flags };
  } else if (ratio < 0.85) {
    flags.push(`Price is slightly below average — verify with landlord`);
    return { score: 70, flags };
  }

  return { score: 100, flags: [] };
}

module.exports = runPriceCheck;