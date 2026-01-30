export default async function handler(req, res) {
  // --- CORS (allow your site only if you want tighter security) ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET (read-only, masked)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const BIN_ID = "6977037dd0ea881f4085fe5c"; // Your login users bin
  const KEY = process.env.JSONBIN_KEY;      // Stored securely in Vercel

  try {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { "X-Master-Key": KEY }
    });

    const bin = await r.json();
    const users = bin.record?.users || [];

    // 🔒 Mask sensitive info before sending to browser
    const safeUsers = users.map(u => ({
      role: u.role,
      username: u.username
        ? u.username[0] + "*".repeat(u.username.length - 1)
        : "User"
      // password NOT included
    }));

    return res.status(200).json({ users: safeUsers });

  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
