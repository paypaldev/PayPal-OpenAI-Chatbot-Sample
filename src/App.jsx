import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'api/chat';

function App() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        // Scroll to the bottom of the chat window when new messages are added
        const chatContainer = document.getElementById('chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [messages]);

    const handleMessageSend = async () => {
        if (inputMessage.trim() === '') return;

        const newMessages = [...messages, { role: 'user', content: inputMessage }];
        setMessages(newMessages);
        setInputMessage('');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await response.json();
            const botReply = { role: 'assistant', content: data.content };
            setMessages([...newMessages, botReply]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="App">
            <div className="chat-container" id="chat-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        {message.content}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleMessageSend}>Send</button>
            </div>
        </div>
    );
}

export default App;
