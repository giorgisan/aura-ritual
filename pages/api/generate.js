export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mood, intent } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY');
    return res.status(500).json({ error: 'Missing OpenAI API Key' });
  }

  const prompt = `Uporabnik se počuti: ${mood}.
Njegova namera za današnji trenutek je: ${intent}.

Na osnovi tega predlagaj:
1. Soundtrack dneva (ime skladbe, izvajalec in YouTube povezava)
2. Kratko osebno prakso (npr. dihalna vaja, afirmacija, gibanje)
3. Navdihujoč citat (ki naj izraža počutje ali namero)

Odgovarjaj nežno, poetično, brez odebeljenih znakov in v strukturirani obliki.
YouTube povezavo dodaj v obliki: ([link](https://...)) na koncu vrstice s skladbo.`;

  try {
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

    if (data.error) {
      console.error('OpenAI API Error:', data.error);
      return res.status(500).json({ error: data.error });
    }

    const rawText = data.choices?.[0]?.message?.content || 'Ni odgovora.';
    return res.status(200).json({ text: rawText });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from OpenAI', details: error.message });
  }
}
