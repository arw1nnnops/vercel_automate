module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY belum ditambahkan di Vercel Settings -> Environment Variables.'
    });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const primary = process.env.GEMINI_MODEL || body.model || 'gemini-4-hydrogen';
  const models = [...new Set([primary, 'gemini-2.5-flash'])];

  let lastStatus = 500;
  let lastMsg = 'Gagal menghubungi Gemini API.';

  for (const modelId of models) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const upstream = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body.payload)
    });

    if (upstream.ok) {
      const data = await upstream.json();
      return res.status(200).json(data);
    }

    lastStatus = upstream.status;
    const errText = await upstream.text().catch(() => '');
    lastMsg = `Model ${modelId} gagal (${upstream.status})${errText ? ': ' + errText.slice(0, 140) : ''}`;
    if (upstream.status === 401 || upstream.status === 403) {
      return res.status(401).json({ error: 'GEMINI_API_KEY di Vercel tidak valid atau diblokir.' });
    }
  }

  return res.status(lastStatus).json({ error: lastMsg });
};
