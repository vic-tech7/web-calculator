const express = require("express")
const OpenAI = require("openai")
require("dotenv").config()
const path = require("path")

const app = express()
const port = 3000

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.use(express.json())

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.use(express.static(__dirname))

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are VEC AI Security Assistant helping with coding, cybersecurity and math."
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

  } catch (error) {
    console.error(error)
    res.status(500).json({ reply: "AI server error." })
  }
})

app.listen(port, () => {
  console.log("Server running at http://localhost:3000")
})