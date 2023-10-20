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
    messages[messages.length-1].content = `${messages[messages.length-1].content}.`

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



app.post('/api/avatar', async (req, res) => {

    const requestData = {
        prompt: `generate picture of animal`,
        n: 2,
        size: '256x256'
    };

    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`
            },
            body: JSON.stringify(requestData)
        });

        console.log(response); // Move this line here

        if (response.ok) {
            const data = await response.json();
            console.log('Response:', data);
            res.json(data.data);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
