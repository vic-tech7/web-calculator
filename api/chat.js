export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      reply: "Method not allowed"
    });
  }

  try {
    const { message } = req.body;

    // API 1: Pollinations
    try {
      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(message)}`
      );

      if (response.ok) {
        const reply = await response.text();

        return res.status(200).json({
          reply
        });
      }
    } catch (err) {
      console.log("Pollinations failed");
    }

    // API 2 backup
    try {
      const response2 = await fetch(
        "https://nexra.aryahcr.cc/api/chat/gpt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: message
              }
            ]
          })
        }
      );

      if (response2.ok) {
        const data = await response2.json();

        return res.status(200).json({
          reply: JSON.stringify(data)
        });
      }
    } catch (err) {
      console.log("Backup API failed");
    }

    return res.status(500).json({
      reply: "All AI providers failed."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      reply: "Connection error."
    });
  }
}