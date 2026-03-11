const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message || message.length > 500) {
        return res.status(400).json({ reply: "Message is empty or too long." });
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_KEY || OPENAI_KEY.trim() === "") {
        return res.status(500).json({ reply: "Server configuration error: AI key is missing. Deploy again after setting it up on Render." });
    }
    
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { 
                        role: "system", 
                        content: "You are a friendly, general-purpose AI assistant integrated into a web-based educational calculator tool. Always be concise and helpful in all topics, including science, math, programming, and general knowledge." 
                    },
                    { 
                        role: "user", 
                        content: message 
                    }
                ],
                temperature: 0.7,
                max_tokens: 300
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json({ reply: response.data.choices[0].message.content.trim() });

    } catch (error) {
        
        console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ reply: "Sorry, I couldn't connect to the AI service right now. Please check the server logs." });
    }
});

app.listen(port, () => {
    console.log(`Server running and serving calculator at port ${port}`);
});

