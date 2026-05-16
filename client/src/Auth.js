import { useState } from 'react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const endpoint = isLogin ? 'login' : 'register';
    try {
      const res = await fetch(`https://rentguard-pink.vercel.app/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.name);
        onLogin(data.name);
      }
    } catch {
      setError('Could not connect to server.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Rent<span>Guard</span></h1>
      <p className="subtitle">AI-powered rental scam detector</p>
      <div className="card">
        <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
          {isLogin ? 'Sign in' : 'Create account'}
        </h2>
        {!isLogin && (
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '12px' }}
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: '12px' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: '16px' }}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
        </button>
        {error && <p className="error" style={{ marginTop: '10px' }}>{error}</p>}
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: '#6c63ff', cursor: 'pointer', fontWeight: '600' }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}