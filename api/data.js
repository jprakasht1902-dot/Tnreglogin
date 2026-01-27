export default async function handler(req, res) {
  // --- 1. ENABLE CORS (Fixes "Connection Failed") ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allows access from anywhere
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle the browser's pre-check (OPTIONS request)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- 2. YOUR ORIGINAL LOGIC STARTS HERE ---
  const BIN_ID = "6977037dd0ea881f4085fe5c"; 
  const KEY = process.env.JSONBIN_KEY;      

  try {
    if (req.method === "GET") {
      const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { "X-Master-Key": KEY }
      });
      // We pass the data back to your frontend
      return res.status(200).json(await r.json());
    }

    if (req.method === "PUT") {
      const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": KEY
        },
        body: JSON.stringify(req.body)
      });
      return res.status(200).json(await r.json());
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
