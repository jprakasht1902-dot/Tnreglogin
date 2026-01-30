export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  const BIN_ID = "6977037dd0ea881f4085fe5c";
  const KEY = process.env.JSONBIN_KEY;

  try {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { "X-Master-Key": KEY }
    });

    const bin = await r.json();
    const users = bin.record?.users || [];

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    return res.status(200).json({
      success: true,
      name: user.username,
      role: user.role
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
