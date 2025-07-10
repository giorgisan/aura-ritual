import { useState } from 'react';
import Head from 'next/head';

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
    <>
      <Head>
        <title>Aura Ritual</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          body {
            margin: 0;
            padding: 2rem;
            font-family: 'Zen Kaku Gothic New', sans-serif;
            background-color: #111;
            color: #f2f2f2;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            animation: fadeInUp 1s ease-out;
          }

          h1 {
            font-size: 2.8rem;
            font-weight: 700;
            margin-bottom: 2rem;
            text-align: center;
            animation: fadeInUp 1s ease-out;
          }

          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            max-width: 420px;
            animation: fadeInUp 1.2s ease-out;
          }

          input {
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border: 1px solid #444;
            border-radius: 8px;
            background: #1c1c1c;
            color: #f2f2f2;
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }

          input::placeholder {
            color: #888;
          }

          input:focus {
            border-color: #888;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
          }

          button {
            padding: 0.75rem 1rem;
            font-size: 1rem;
            background-color: #fff;
            color: #111;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(255, 255, 255, 0.1);
          }

          button:hover {
            background-color: #eaeaea;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(255, 255, 255, 0.15);
          }

          .result {
            margin-top: 2rem;
            white-space: pre-line;
            font-style: italic;
            line-height: 1.6;
            animation: fadeInUp 1.4s ease-out;
            background-color: #1c1c1c;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #333;
          }

          .error {
            margin-top: 2rem;
            color: #ff6b6b;
            animation: fadeInUp 1.4s ease-out;
          }
        `}</style>
      </Head>
      <main>
        <h1>Aura Ritual</h1>
        <form onSubmit={handleSubmit}>
          <input name="mood" placeholder="Kako se počutiš?" onChange={handleChange} required />
          <input name="timeOfDay" placeholder="Čas dneva" onChange={handleChange} required />
          <input name="emotion" placeholder="Čustveno stanje" onChange={handleChange} required />
          <input name="need" placeholder="Kaj potrebuješ?" onChange={handleChange} required />
          <button type="submit">Pridobi ritual</button>
        </form>
        {result && <div className="result">{result}</div>}
        {error && <div className="error">{error}</div>}
      </main>
    </>
  );
}
