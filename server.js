const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static('public')); 

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are VEC AI Security Assistant, a helpful penetration testing assistant. Provide clear, educational responses about security concepts, exploits, tools, and coding. Always emphasize ethical hacking and responsible disclosure.' },
        { role: 'user', content: message }
      ],
      max_tokens: 500
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

