export default async function handler(req, res) {
  const BIN_ID = "6977037dd0ea881f4085fe5c"; // login bin
  const KEY = process.env.JSONBIN_KEY;      // stored in Vercel

  try {
    if (req.method === "GET") {
      const r = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { "X-Master-Key": KEY }
      });
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
