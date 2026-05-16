import { useState } from 'react';

const getVerdictClass = (verdict) => {
  if (verdict === 'Safe') return 'verdict-safe';
  if (verdict === 'Suspicious') return 'verdict-suspicious';
  return 'verdict-scam';
};

const getVerdictEmoji = (verdict) => {
  if (verdict === 'Safe') return '✅';
  if (verdict === 'Suspicious') return '⚠️';
  return '🚨';
};

export default function App() {
  const [form, setForm] = useState({ text: '', price: '', city: 'karachi', area: '', imageUrl: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
const res = await fetch('https://rentguard-pink.vercel.app/api/analyze', {        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: form.text,
          price: Number(form.price),
          city: form.city,
          area: form.area,
          imageUrl: form.imageUrl
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Could not connect to server. Make sure the backend is running.');
    }
    setLoading(false);
  };

const allFlags = result
  ? [
      ...(result.breakdown.nlp?.flags || []),
      ...(result.breakdown.price?.flags || []),
      ...(result.breakdown.image?.flags || [])
    ]
  : [];
  return (
    <div className="container">
      <h1>Rent<span>Guard</span></h1>
      <p className="subtitle">AI-powered rental scam detector: paste a listing and get a trust score instantly.</p>

      <div className="card">
        <textarea
          name="text"
          placeholder="Paste the rental listing description here..."
          value={form.text}
          onChange={handleChange}
        />
        <div className="row">
          <input
            name="price"
            type="number"
            placeholder="Monthly rent (PKR)"
            value={form.price}
            onChange={handleChange}
          />
          <select name="city" value={form.city} onChange={handleChange}>
            <option value="karachi">Karachi</option>
            <option value="lahore">Lahore</option>
            <option value="islamabad">Islamabad</option>
          </select>
        </div>
        <div className="row">
          <input
            name="area"
            placeholder="Area (e.g. DHA, Gulshan)"
            value={form.area}
            onChange={handleChange}
          />
        </div>
        <div className="row">
          <input
            name="imageUrl"
            placeholder="Listing image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Listing'}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      {result && (
        <>
          <div className="card">
            <div className="score-block">
              <div className={`score-number ${getVerdictClass(result.verdict)}`}>
                {result.trust_score}
              </div>
              <div className={`score-label ${getVerdictClass(result.verdict)}`}>
                {getVerdictEmoji(result.verdict)} {result.verdict}
              </div>
            </div>
          </div>

          <div className="card">
            <p className="section-title">Module breakdown</p>
            <div className="module-row">
              <span>NLP scam detection</span>
              <span className="module-score">{result.breakdown.nlp.score}/100</span>
            </div>
            <div className="module-row">
              <span>Price benchmarking</span>
              <span className="module-score">{result.breakdown.price.score}/100</span>
            </div>
           <div className="module-row">
  <span>Reverse image search</span>
  <span className="module-score">{result.breakdown.image?.score ?? 'N/A'}/100</span>
</div>
          </div>

          <div className="card">
            <p className="section-title">Flags detected</p>
            {allFlags.length === 0
              ? <p className="no-flags">✅ No suspicious flags found</p>
              : allFlags.map((flag, i) => <div key={i} className="flag">{flag}</div>)
            }
          </div>
        </>
      )}
    </div>
  );
}