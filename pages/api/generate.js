
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mood, timeOfDay, emotion, need } = req.body;

  const prompt = `Uporabnik se počuti: ${mood}.
Čas dneva: ${timeOfDay}.
Čustveno stanje: ${emotion}.
Potrebuje: ${need}.

Predlagaj:
1. Soundtrack dneva
2. Osebno aktivnost
3. Večerni ritual

Odgovarjaj nežno in poetično, z občutkom.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85
    })
  });

  const data = await response.json();
  res.status(200).json({ result: data.choices[0].message.content });
}
