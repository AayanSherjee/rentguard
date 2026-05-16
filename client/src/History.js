import { useState, useEffect } from 'react';

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

export default function History({ onBack }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('https://rentguard-pink.vercel.app/api/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setScans(data);
      } catch {
        console.error('Failed to fetch history');
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <h1>Rent<span>Guard</span></h1>
      </div>
      <p className="subtitle">Your scan history</p>
      <button
        onClick={onBack}
        style={{ width: 'auto', padding: '10px 20px', marginBottom: '24px', background: '#f0f0f0', color: '#333' }}
      >
        ← Back to analyzer
      </button>

      {loading && <p style={{ color: '#666' }}>Loading history...</p>}

      {!loading && scans.length === 0 && (
        <div className="card">
          <p style={{ color: '#666', textAlign: 'center' }}>No scans yet — analyze a listing first.</p>
        </div>
      )}

      {scans.map((scan, i) => (
        <div className="card" key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className={`score-label ${getVerdictClass(scan.verdict)}`} style={{ fontSize: '16px' }}>
              {getVerdictEmoji(scan.verdict)} {scan.verdict}
            </span>
            <span style={{ fontSize: '28px', fontWeight: '700' }} className={getVerdictClass(scan.verdict)}>
              {scan.trust_score}/100
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>
            {scan.city} {scan.area ? `· ${scan.area}` : ''} {scan.price ? `· PKR ${scan.price}` : ''} · {new Date(scan.createdAt).toLocaleDateString()}
          </p>
          {scan.flags && scan.flags.length > 0 && (
            <div>
              {scan.flags.map((flag, j) => (
                <div key={j} className="flag" style={{ marginBottom: '6px' }}>{flag}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}