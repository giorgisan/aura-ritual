
import { useState } from 'react';

export default function Home() {
  const [mood, setMood] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [emotion, setEmotion] = useState('');
  const [need, setNeed] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, timeOfDay, emotion, need })
    });
    const data = await res.json();
    if (data.result) setResponse(data.result);
    else setResponse("Napaka: " + (data.error || "neznana")); 
    setLoading(false);
  }

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Aura Ritual</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Kako se počutiš?" value={mood} onChange={(e) => setMood(e.target.value)} /><br/>
        <input placeholder="Čas dneva" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)} /><br/>
        <input placeholder="Čustveno stanje" value={emotion} onChange={(e) => setEmotion(e.target.value)} /><br/>
        <input placeholder="Kaj potrebuješ?" value={need} onChange={(e) => setNeed(e.target.value)} /><br/>
        <button type="submit" disabled={loading}>{loading ? 'Ustvarjam...' : 'Pridobi ritual'}</button>
      </form>
      {response && (
        <pre style={{ marginTop: 20 }}>{response}</pre>
      )}
    </main>
  );
}
