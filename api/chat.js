export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent(message)}`
    );

    const reply = await response.text();

    return res.status(200).json({
      reply: reply
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      reply: "Connection error."
    });
  }
}