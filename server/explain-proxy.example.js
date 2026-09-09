/**
 * OPTIONAL — not wired into the app.
 *
 * This app works fully without this file. It's here only if you later want
 * to add an "explain this trial in plain language" feature powered by an
 * LLM. Two things matter if you do:
 *
 *   1. NEVER put an API key in index.html or any file under js/ — anything
 *      shipped to the browser (and therefore to a public GitHub repo or
 *      GitHub Pages site) is world-readable. Keys belong on a server only.
 *   2. This file is a serverless function (Vercel / Netlify-style) that
 *      keeps your key server-side and proxies one request at a time.
 *
 * Setup (Vercel example):
 *   1. Rename this file to api/explain.js
 *   2. `vercel env add ANTHROPIC_API_KEY` (get a key at console.anthropic.com)
 *   3. Deploy. Call it from the browser as POST /api/explain
 *      with JSON body { criteriaText: "..." }
 *
 * Anthropic API docs: https://docs.claude.com
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  const { criteriaText } = req.body || {};
  if (!criteriaText || typeof criteriaText !== 'string') {
    return res.status(400).json({ error: 'Missing criteriaText' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content:
            'Rewrite the following clinical trial eligibility criteria in plain, ' +
            'patient-friendly language. Do not add, remove, or soften any inclusion ' +
            'or exclusion condition — this is a faithful translation, not a summary ' +
            'that drops details. If something is medically ambiguous, say so rather ' +
            `than guessing.\n\n${criteriaText}`
        }]
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      return res.status(502).json({ error: 'Upstream error', detail });
    }

    const data = await response.json();
    const text = data.content?.map((b) => b.text || '').join('\n') || '';
    return res.status(200).json({ explanation: text });
  } catch (err) {
    return res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}
