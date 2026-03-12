const express = require("express")
const OpenAI = require("openai")
require("dotenv").config()

const app = express()
const port = 3000

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.use(express.json())
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are VEC AI Security Assistant. Help with programming, cybersecurity, penetration testing concepts, and debugging code. Always promote ethical hacking."
        },
        {
          role: "user",
          content: message
        }
      ]
    })

    res.json({
      reply: completion.choices[0].message.content
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ reply: "AI server error." })
  }
})

app.listen(port, () => {
  console.log("Server running on http://localhost:3000")
})