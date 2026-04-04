// Vercel Serverless Function — /api/parse-boxscore
// Accepts a PDF/image of a box score, sends to Claude Vision API, returns parsed stats

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { image, mimeType, text, gameId, awayTeam, homeTeam, date, week, field } = req.body;

  if (!image && !text) return res.status(400).json({ error: 'No box score data provided. Send either an image (base64) or text.' });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  const prompt = `You are parsing a baseball box score. This is from the South Florida Baseball League (SFBL), an adult wood bat league. Games are 9 innings.

Extract ALL data and return ONLY valid JSON, no other text.

Game info:
- Away Team: ${awayTeam || 'Unknown'}
- Home Team: ${homeTeam || 'Unknown'}
- Date: ${date || 'Unknown'}
- Week: ${week || ''}
- Field: ${field || ''}
- Game ID: ${gameId || ''}

Return this exact JSON structure:
{
  "awayScore": <number>,
  "homeScore": <number>,
  "awayBatters": [
    {
      "name": "<full name>",
      "num": "<jersey number or empty string>",
      "pos": "<position or empty string>",
      "ab": <number>,
      "r": <number>,
      "s": <singles - calculate from hits minus extra base hits>,
      "d": <doubles>,
      "t": <triples>,
      "hr": <home runs>,
      "rbi": <number>,
      "bb": <walks>,
      "so": <strikeouts>
    }
  ],
  "homeBatters": [<same structure>],
  "awayPitchers": [
    {
      "name": "<name>",
      "ip": "<innings pitched as string like '7.0' or '6.2'>",
      "h": <hits allowed>,
      "r": <runs>,
      "er": <earned runs>,
      "bb": <walks>,
      "so": <strikeouts>,
      "hr": <home runs allowed>,
      "decision": "<W, L, S, or empty string>"
    }
  ],
  "homePitchers": [<same structure>],
  "linescore": {
    "away": [<inning 1>, <inning 2>, ..., <up to 9 innings>],
    "home": [<inning 1>, <inning 2>, ..., <up to 9 innings>],
    "awayRuns": <total runs>,
    "homeRuns": <total runs>,
    "awayHits": <total hits>,
    "homeHits": <total hits>,
    "awayErrors": <total errors>,
    "homeErrors": <total errors>
  },
  "notes": "<any notable info: home runs, winning/losing pitcher, key plays>"
}

Important:
- If this is a GameChanger PDF, all stats should be clearly labeled
- If this is a handwritten scorebook photo, do your best to read the handwriting
- Names may be truncated - do your best to read full names
- If a stat is missing or unreadable, use 0
- Singles (s) = total hits minus doubles minus triples minus home runs
- Return ONLY the JSON object, nothing else`;

  try {
    // Build Claude API message based on input type
    let content;
    if (image) {
      // Image/PDF input - use Claude Vision
      content = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mimeType || 'image/png',
            data: image
          }
        },
        { type: 'text', text: prompt }
      ];
    } else {
      // Text input fallback
      content = prompt + '\n\nBox score text:\n' + text;
    }

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 6000,
        messages: [{
          role: 'user',
          content: Array.isArray(content) ? content : [{ type: 'text', text: content }]
        }]
      })
    });

    const claudeData = await claudeRes.json();
    if (!claudeRes.ok) throw new Error(`Claude API error: ${claudeData.error?.message || JSON.stringify(claudeData)}`);

    const rawText = claudeData.content[0].text.trim();
    const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonText);

    return res.status(200).json({
      success: true,
      parsed,
      gameId,
      awayTeam,
      homeTeam,
      date,
      week,
      field
    });

  } catch (err) {
    console.error('parse-boxscore error:', err);
    return res.status(500).json({ error: err.message });
  }
}
