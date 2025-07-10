// pages/index.js
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [form, setForm] = useState({ mood: '', intention: '' });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setResult(data.text);
      } else {
        setError(`Napaka: ${data?.error?.message || 'neznana'}`);
      }
    } catch (err) {
      setError(`Napaka: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyQuote = () => {
    const match = result.match(/<h2 class="quote">.*?<\/h2>\s*<p>(.*?)<\/p>/s);
    if (match) {
      const text = match[1].replace(/<[^>]*>/g, '').trim();
      navigator.clipboard.writeText(text);
      alert('Citat kopiran!');
    } else {
      alert('Citat ni bil prepoznan.');
    }
  };

  return (
    <>
      <Head>
        <title>Aura Ritual</title>
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.08); opacity: 1; }
            100% { transform: scale(1); opacity: 0.6; }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          body {
            margin: 0;
            font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
            background-color: #111;
            color: #f0f0f0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding-top: 5vh;
          }

          main {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 1rem;
          }

          h1 {
            font-size: 2.75rem;
            font-weight: 500;
            margin-bottom: 2rem;
            text-align: center;
          }

          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            max-width: 420px;
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 0 30px rgba(255,255,255,0.03);
          }

          input {
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border: none;
            border-radius: 8px;
            background: #2a2a2a;
            color: #fff;
            outline: none;
          }

          input::placeholder {
            color: #aaa;
          }

          button {
            padding: 0.75rem;
            background-color: #fff;
            color: #111;
            font-weight: 600;
            font-size: 1rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.2s ease;
          }

          button:hover {
            transform: translateY(-2px);
          }

          .loader {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #fff;
            opacity: 0.1;
            animation: pulse 2.4s infinite;
            margin: 3rem auto;
          }

          .result {
            margin-top: 2rem;
            max-width: 700px;
            font-size: 1.05rem;
            line-height: 1.65;
            animation: fadeIn 0.9s ease-out;
          }

          .result a {
            color: #9dd4ff;
            text-decoration: underline;
          }

          .soundtrack {
            color: #aad8ff;
            text-align: center;
            margin-top: 2rem;
          }

          .practice {
            color: #b5fdd1;
            text-align: center;
            margin-top: 2.5rem;
          }

          .quote {
            color: #ffd1f7;
            text-align: center;
            margin-top: 2.5rem;
          }

          .copy-btn {
            margin-top: 1.5rem;
            background: transparent;
            border: 1px solid #555;
            color: #ccc;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.95rem;
            cursor: pointer;
            transition: background 0.2s ease;
          }

          .copy-btn:hover {
            background: #222;
          }

          .error {
            color: #f55;
            margin-top: 2rem;
          }
        `}</style>
      </Head>

      <main>
        <h1>Aura Ritual</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="mood"
            placeholder="Kako se počutiš?"
            onChange={handleChange}
            value={form.mood}
            required
          />
          <input
            name="intention"
            placeholder="Kaj je tvoja današnja namera?"
            onChange={handleChange}
            value={form.intention}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Ustvarjanje...' : 'Pridobi ritual'}
          </button>
        </form>

        {loading && <div className="loader"></div>}

        {result && (
          <>
            <div
              className="result"
              dangerouslySetInnerHTML={{ __html: result }}
            />
            <button className="copy-btn" onClick={copyQuote}>
              Kopiraj citat
            </button>
          </>
        )}

        {error && <div className="error">{error}</div>}
      </main>
    </>
  );
}
