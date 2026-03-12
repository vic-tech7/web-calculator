export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })
  const { message } = req.body
  if (!message) return res.status(400).json({ error: "No message provided" })
  let reply = ""
  const msg = message.toLowerCase()
  if (msg.includes("hello") || msg.includes("hi")) reply = "Hello! How can I help you with security or code today?"
  else if (msg.includes("exploit") || msg.includes("vulnerability")) reply = "Always ensure proper authorization and testing in safe environments!"
  else reply = "I’m your AI assistant. Ask me about exploits, tools, or paste code."
  return res.status(200).json({ reply })
}