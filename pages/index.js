import { useState } from 'react';

export default function Home() {
  const [mood, setMood] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [emotion, setEmotion] = useState('');
  const [need, setNeed] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, timeOfDay, emotion, need })
      });
      const data = await response.json();
      if (data.raw?.choices?.[0]?.message?.content) {
        setResult(data.raw.choices[0].message.content);
      } else {
        setResult('Napaka: neznana');
        console.log('Raw OpenAI response:', data.raw || data);
      }
    } catch (err) {
      console.error(err);
      setResult('Napaka: strežniška napaka');
    }
  };

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Aura Ritual</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Kako se počutiš?" value={mood} onChange={(e) => setMood(e.target.value)} /><br />
        <input placeholder="Čas dneva" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)} /><br />
        <input placeholder="Čustveno stanje" value={emotion} onChange={(e) => setEmotion(e.target.value)} /><br />
        <input placeholder="Kaj potrebuješ?" value={need} onChange={(e) => setNeed(e.target.value)} /><br />
        <button type="submit">Pridobi ritual</button>
      </form>
      <p>{result}</p>
    </main>
  );
}
