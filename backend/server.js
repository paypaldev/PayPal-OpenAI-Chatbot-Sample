import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "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" // Use your actual OpenAI API key here
});

const app = express();
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
    const demoModel = [
        { role: 'user', content: 'Hi, can you tell me where to find information about the paypal javascript sdk?' },
        { role: 'assistant', content: 'Yes, the conentent can be found inside of this website https://developer.paypal.com/dashboard/' },
    ];

    const { messages } = req.body;
    messages[messages.length-1].content = `${messages[messages.length-1].content}. Use the https://developer.paypal.com/ to find your information.`

    try {
        const response =  await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [...messages, ...demoModel],
        });
        console.log(response)
        res.json(response.choices[0].message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
