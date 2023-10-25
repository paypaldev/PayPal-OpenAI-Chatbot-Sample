import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

console.log(process.env.OPENAI_API_KEY)

const app = express();
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {

    /*
    Train the model by giving it some previous conversations
    */
    const demoModel = [
        { role: 'user', content: 'Hi, can you tell me where to find information about the paypal javascript sdk?' },
        { role: 'assistant', content: 'Yes, the conentent can be found inside of this website https://developer.paypal.com/dashboard/' },
        { role: 'user', content: 'can you tell me where to find information about the paypal orders api?' },
        { role: 'assistant', content: 'Yes, the conentent can be found inside of this website https://developer.paypal.com/docs/api/orders/v2/#orders_create' },
        { role: 'user', content: 'can you tell me how to style my paypal buttons?' },
        {
            role: 'assistant', content: `Yes, to style the paypal buttons follow this guide https://developer.paypal.com/sdk/js/reference/#link-style and this
        sample code
        paypal.Buttons({
            style: {
              layout: 'vertical',
              color:  'blue',
              shape:  'rect',
              label:  'paypal'
            }
          }).render('#paypal-button-container');
        `},
    ];

    const { messages } = req.body;
    messages[messages.length - 1].content = `${messages[messages.length - 1].content}.`

    /**
     * Call the OpenAI SDK and get a response
     */
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [...messages, ...demoModel], // pass the new message and the previous messages
        });
        console.log(response)
        res.json(response.choices[0].message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Generate a random animal avatar
 * using DALLE
 */
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
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(requestData)
        });

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
