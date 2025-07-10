// pages/index.js
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
        <style>{`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          body {
            margin: 0;
            padding: 2rem;
            font-family: 'Helvetica Neue', sans-serif;
            background-color: #f9f9f9;
            color: #111;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            animation: fadeInUp 1s ease-out;
          }

          h1 {
            font-size: 2.5rem;
            font-weight: 600;
            margin-bottom: 2rem;
            text-align: center;
            animation: fadeInUp 1s ease-out;
          }

          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            max-width: 400px;
            animation: fadeInUp 1.2s ease-out;
          }

          input {
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 10px;
            background: #fff;
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }

          input:focus {
            border-color: #555;
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
          }

          button {
            padding: 0.75rem 1rem;
            font-size: 1rem;
            background-color: #111;
            color: #fff;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
          }

          button:hover {
            background-color: #333;
            transform: translateY(-2px);
          }

          .result {
            margin-top: 2rem;
            white-space: pre-line;
            font-style: italic;
            line-height: 1.6;
            animation: fadeInUp 1.4s ease-out;
          }

          .error {
            margin-top: 2rem;
            color: #c00;
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
