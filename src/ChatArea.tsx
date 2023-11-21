import React, { useEffect, useState } from 'react';
import { useGlobalContext } from './GlobalContext';

const ChatArea = () => {
    const { domain, port } = useGlobalContext();
    const [messages, setMessages] = useState([]);

        useEffect(() => {
            const fetchMessages = async () => {
                try {
                    const token = getCookie('token'); // Get the token from the cookie
                    if (token) {
                        const response = fetch(`http://${domain}:${port}/chat/poll`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ token })
                        });
                        const data = await (await response).json();
                        setMessages(data.messages);
                    } else {
                        // Redirect to login page
                        window.location.href = '/login';
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };

            const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
            return () => clearInterval(interval);
        }, []);

        // Function to get the value of a cookie
        const getCookie = (name: string) => {
            const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
            return cookieValue ? cookieValue.pop() : '';
        };

        return (
            <div className="chat-area">
                {/* Dynamically populate messages */}
                {messages.map((message, index) => (
                    <div key={index}>
                        <span>{message.username}: </span>
                        <span>{message.message}</span>
                    </div>
                ))}
            </div>
        );
    };

    export default ChatArea;