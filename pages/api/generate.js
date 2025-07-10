export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mood, timeOfDay, emotion, need } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY');
    return res.status(500).json({ error: 'Missing OpenAI API Key' });
  }

  const prompt = `Uporabnik se počuti: ${mood}.
Čas dneva: ${timeOfDay}.
Čustveno stanje: ${emotion}.
Potrebuje: ${need}.

Predlagaj:
1. Soundtrack dneva
2. Osebno aktivnost
3. Večerni ritual

Odgovarjaj nežno in poetično, z občutkom.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // ← posodobljen model
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.85
      })
    });

    const data = await response.json();

    if (data.error) {
