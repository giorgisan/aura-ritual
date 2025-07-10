export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body ?? JSON.parse(req.body);
  const { mood, timeOfDay, emotion, need } = body;

  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY');
    return res.status(500).json({ error: 'Missing OpenAI API Key' });
  }

  const prompt = `Uporabnik se počuti: ${mood}.
Čas dneva: ${timeOfDay
