import { useState } from 'react';
import Head from 'next/head';

const inspirationalQuotes = [
  "Mir prihaja od znotraj. Ne išči ga zunaj. – Buda",
  "Tudi to bo minilo. – Perzijski pregovor",
  "Najgloblje tišine govorijo najglasneje.",
];

export default function Home() {
  const [form, setForm] = useState({ mood: '', need: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    setQuote('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.raw?.choices?.[0]?.message?.content) {
        const content = data.raw.choices[0].message.content;
        setResult(content);

        const q = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
        setQuote(q);
      } else {
        setError(`Napaka: ${data?.error?.message || 'neznana'}`);
      }
    } catch (err) {
      setError(`Napaka: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Aura Ritual</title>
        <link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" />
        <style>{`
          body {
            background-color: #111;
            color: #eee;
            font-family: 'Nunito', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            min-height: 100vh;
          }

          h1 {
            font-size: 2.4rem;
            text-align: center;
          }

          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            max-width: 400px;
            margin: auto;
          }

          input {
            padding: 0.8rem;
            font-size: 1rem;
            border-radius: 6px;
            border: none;
            background: #222;
            color: #fff;
          }

          button {
            padding: 0.8rem;
            font-size: 1rem;
            background: #fff;
            color: #000;
            border: none;
            cursor: pointer;
            transition: 0.3s ease;
          }

          button:hover {
            background: #ccc;
          }

          .loading {
            text-align: center;
            font-style: italic;
          }

          .result {
            margin-top: 2rem;
            white-space: pre-line;
          }

          .quote {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #aaa;
            font-style: italic;
          }
        `}</style>
      </Head>

      <main>
        <h1>Aura Ritual</h1>
        <form onSubmit={handleSubmit}>
          <input name="mood" placeholder="Kako se počutiš?" onChange={handleChange} required />
          <input name="need" placeholder="Kaj potrebuješ?" onChange={handleChange} required />
          <button type="submit">Pridobi ritual</button>
        </form>

        {loading && <div className="loading">✨ Nalagam tvoj ritual ...</div>}
        {result && <div className="result">{result}</div>}
        {quote && <div className="quote">{quote}</div>}
        {error && <div className="error">{error}</div>}
      </main>
    </>
  );
}
