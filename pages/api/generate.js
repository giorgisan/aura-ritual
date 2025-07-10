// /pages/api/generate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mood, intention } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY');
    return res.status(500).json({ error: 'Missing OpenAI API Key' });
  }

  const prompt = `Uporabnik se počuti: ${mood}.
Njegova namera za danes: ${intention}.

Na osnovi tega pripravi:
1. Kratek uvodni odstavek.
2. Soundtrack dneva: naslov skladbe, izvajalec in YouTube povezava v obliki pravega HTML <a href="...">povezava</a>.
3. Kratko osebno prakso.
4. Navdihujoč citat z avtorjem.

Strukturo odgovora zapiši neposredno kot HTML. Naslove označi z <h2> in dodaj razrede:
- h2 za soundtrack: class="soundtrack"
- h2 za prakso: class="practice"
- h2 za citat: class="quote"

Besedila naj bodo nežna, introspektivna, brez oznak **, brez številk. Vključi prazno vrstico med odstavki.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.85,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API Error:', data.error);
      return res.status(500).json({ error: data.error });
    }

    const html = data.choices?.[0]?.message?.content || 'Ni odgovora.';
    return res.status(200).json({ text: html });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from OpenAI', details: error.message });
  }
}
