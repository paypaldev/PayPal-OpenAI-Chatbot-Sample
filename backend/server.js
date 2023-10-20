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
    const {prompt} = req.body;
    try {
        const response = openai.Image.create(
            prompt= `Create an avatar for the ${prompt} of a chat`,
            n=2,
            size="512x512"
          )
        imageUrl = response.data[0].url;
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
