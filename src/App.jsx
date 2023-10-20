import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setisLoading] = useState('START');
    const [userImage, setUserImage] = useState(null);
    const [assistantImage, setAssistantImage] = useState(null);

    const handleMessageSend = async () => {
        setisLoading('LOADING');
        if (inputMessage.trim() === '') return;

        const newMessages = [...messages, { role: 'user', content: inputMessage }];
        setMessages(newMessages);
        setInputMessage('');

        try {
            const response = await fetch("api/chat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await response.json();
            const botReply = { role: 'assistant', content: data.content };
            setisLoading('DONE');
            setMessages([...newMessages, botReply]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // Scroll to the bottom of the chat window when new messages are added
        const chatContainer = document.getElementById('chat-container');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [messages]);

    useEffect(() =>{
        const generateImage = async () =>{
            try {
                const response = await fetch("api/avatar", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt }),
                });
                const data = await response.json();
                console.log('images', data)
                setUserImage(data[0].url)
                setAssistantImage(data[1].url)
                return data;
            } catch (error) {
                console.error(error);
            }
        }
        generateImage();
    },  [])

    return (
        <div className="App">
                <div className="chat-container" id="chat-container">
                        {messages.map((message, index) => (
                            message.content !== undefined ?
                            (<div key={index} className={`message ${message.role}`}>
                                <img src={message.role === 'user' ? userImage : assistantImage} alt="user image" className="avatar" />
                                {message.role === 'assistant' ? (
                                    <div className="assistant-message">
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    message.content
                                )}
                            </div>)
                            :
                            <div key={index} className="message assistant">
                                Error in the server
                            </div>
                        ))}
                        {(isLoading === 'START' || isLoading === 'DONE') ? <></>  :
                         <div className="spinner-bar">
                                <div className="spinner chat"></div>
                        </div>}
                </div>
                    <div className="input-container">
                    { assistantImage !== null && userImage!== null ?
                        <>
                            <textarea
                                rows="4" cols="50"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Chat with the AI bot"
                            />
                            <button onClick={handleMessageSend}>Send</button>

                        </>
                        :
                        (<div className="spinner"></div>)
                    }
            </div>
        </div>
    );
}

export default App;
