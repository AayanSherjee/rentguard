import { useState, useEffect } from 'react';
import Auth from './Auth';
import History from './History';

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
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('analyze');
  const [form, setForm] = useState({ text: '', price: '', city: 'karachi', area: '', imageUrl: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    if (token && name) setUser(name);
  }, []);

  const handleLogin = (name) => setUser(name);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setUser(null);
    setResult(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://rentguard-pink.vercel.app/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
    } catch {
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

  if (!user) return <Auth onLogin={handleLogin} />;
  if (page === 'history') return <History onBack={() => setPage('analyze')} />;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <h1>Rent<span>Guard</span></h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setPage('history')}
            style={{ width: 'auto', padding: '8px 16px', background: '#f0f0f0', color: '#333', fontSize: '14px' }}
          >
            History
          </button>
          <button
            onClick={handleLogout}
            style={{ width: 'auto', padding: '8px 16px', background: '#fee2e2', color: '#dc2626', fontSize: '14px' }}
          >
            Logout
          </button>
        </div>
      </div>
      <p className="subtitle">Welcome, {user} — paste a listing to check if it's a scam.</p>

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