![PayPal Developer Cover](https://github.com/paypaldev/.github/blob/main/pp-cover.png)

<div align="center">
  <a href="https://twitter.com/paypaldev" target="_blank">
    <img alt="Twitter: PayPal Developer" src="https://img.shields.io/twitter/follow/paypaldev?style=social" />
  </a>
  <br />
  <a href="https://twitter.com/paypaldev" target="_blank">Twitter</a>
    <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
  <a href="https://www.paypal.com/us/home" target="_blank">PayPal</a>
    <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
  <a href="https://developer.paypal.com/home" target="_blank">Docs</a>
    <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
  <a href="https://github.com/paypaldev" target="_blank">Code Samples</a>
    <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
  <a href="https://dev.to/paypaldeveloper" target="_blank">Blog</a>
  <br />
  <hr />
</div>

# PayPal OpenAI Chatbot Sample

This sample app shows how to build and customize a a chatbot using [OpenAI APIs and SDK](https://platform.openai.com/docs/introduction). In this demo we also make use of DALLE for the generation of AI image to be used as avatars in the chat.

## Run this project

### PayPal Codespaces

[![Open Code In GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/paypaldev/PayPal-OpenAI-Chatbot-Sample)
- Open the code in GitHub code spaces using the link above.
- In the `.env` file enter your `OPENAI_API_KEY`.
- Add your environment variables in the `.env` file.
- Run `npm run start` to run your NodeJS server in the port 5000.
- In a separate terminal run `npm run dev` to run your React application.
- Open [http://localhost:3000/](http://localhost:3000/) in your browser.

### Locally

- Clone this repo
- In the `.env` file enter your `OPENAI_API_KEY`.
- Add your environment variables in the `.env` file.
- Run `npm run start` to run your NodeJS server in the port 5000.
- In a separate terminal run `npm run dev` to run your React application.
- Open [http://localhost:3000/](http://localhost:3000/) in your browser.

## ChatBot Functionality - server.js

This code uses the [OpenAI SDK method **completions**](https://platform.openai.com/docs/guides/gpt/chat-completions-api) to generate a conversation using ChatGPT 3.5 for the conversationinal AI. We also provided a `demoModel` to train our chatbot to focus on content around the PayPal Developer documentation.

```javascript
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
```

## AI Images With DALLE - server.js

This code uses the the [Image Create endpoint](https://platform.openai.com/docs/api-reference/images) that uses DALLE in the background to generate the AI images (avatars) for the chatbot.

```javascript
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
```


## PayPal Developer Community

The PayPal Developer community helps you build your career while improving your products and the developer experience. You’ll be able to contribute code and documentation, meet new people and learn from the open-source community.

- Website: [developer.paypal.com](https://developer.paypal.com)
- Twitter: [@paypaldev](https://twitter.com/paypaldev)
- GitHub: [@paypal](https://github.com/paypal)