// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({ mood: '', timeOfDay: '', emotion: '', need: '' });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.raw?.choices?.[0]?.message?.content) {
        setResult(data.raw.choices[0].message.content);
      } else {
        setError(`Napaka: ${data?.error?.message || 'neznana'}`);
      }
    } catch (err) {
      setError(`Napaka: ${err.message}`);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '600' }}>Aura Ritual</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <input name="mood" placeholder="Kako se počutiš?" onChange={handleChange} required />
        <input name="timeOfDay" placeholder="Čas dneva" onChange={handleChange} required />
        <input name="emotion" placeholder="Čustveno stanje" onChange={handleChange} required />
        <input name="need" placeholder="Kaj potrebuješ?" onChange={handleChange} required />
        <button type="submit" style={{ backgroundColor: '#111', color: '#fff', padding: '0.75rem', border: 'none' }}>Pridobi ritual</button>
      </form>

      {result && <div style={{ marginTop: '2rem', whiteSpace: 'pre-line', fontStyle: 'italic' }}>{result}</div>}
      {error && <div style={{ marginTop: '2rem', color: '#c00' }}>{error}</div>}
    </main>
  );
}
