import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { useChatContext } from '../../context/ChatContext';
import styles from './ChatArea.module.css';

const ChatArea = () => {
    const { domain, port, token, isConnected, setIsConnected, user_id } = useGlobalContext();
    const { messages, addMessage } = useChatContext();
    const [messageBox, setMessageBox] = useState(''); // State for the messageBox textbox
    const [toUser, setToUser] = useState(''); // State for the toUser textbox

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (token !== '' && isConnected) {
                    const response = await fetch(`http://${domain}:${port}/chat/poll`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token }),
                    });
                    const data = await response.json();
                    //if polling data is empty, then return
                    //if (data.messages.length === 0) {
                    //    return;
                    //}
                    
                    //print out the data
                    //console.log("Polling data: ", data );


                    // Add new messages to the global state using addMessage
                    data.messages.forEach((message) => {
                        const { username: user, message: text } = message;
                        addMessage({
                            username: user,
                            message: text,
                            timestamp: new Date(),
                        });
                        //add the new messages to the conversation list
                        
                    });
                } else {
                    //console.log('Not connected');
                    //console.log("Token: ", token, " isConnected: ", isConnected);
                    //setIsConnected(false);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const interval = setInterval(fetchMessages, 1000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [addMessage]); // Add addMessage as a dependency to avoid a lint warning

    // Create a function which displays a dummy message
    const displayDummyMessage = () => {
        addMessage({
            //id: '1',
            username: 'Dummy',
            message: 'This is a dummy message',
            timestamp: new Date(),
        });
    };

   // Function to send a message
   const sendMessage = async () => {
    if (toUser && messageBox) {
        //if toUser contains spaces, then return
        if(toUser.includes(" ")) {
            console.log("Username cannot contain spaces");
            return;
        }
        try {
            const response = await fetch(`http://${domain}:${port}/chat/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, username: toUser, message: messageBox }),
            });
            const data = await response.json();

            if (data.send) {
                console.log(data.send)
                // Handle success (e.g., clearing the message box, displaying a notification, etc.)
                setMessageBox(''); // Clear the message box
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
        finally {
            //const user = user_id;
            console.log("Message sent to User:", toUser)
            //append the message to the chat area
            addMessage({
                username:user_id,
                message: messageBox,
                timestamp: new Date(),
            });
        }
    }
};

// Handle Enter key in messageBox
const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        sendMessage();
        setMessageBox(''); // Clear the message box
        e.preventDefault(); // Prevent form submission
    }
};

return (
<div className={styles["chat-area"]}>
    <div className={styles["message-list"]}>
            {messages.map((message, index) => {
                const isSender = message.username === user_id;
                const isSystem = message.username === 'System';
                const messageClass = isSender
                    ? styles["message-sender"]
                    : isSystem
                    ? styles["message-system"]
                    : styles["message-recipient"];

                return (
                    <div key={index} className={messageClass}>
                        {!isSystem && (
                            <div className={styles["message-header"]}>
                                <span className={styles["message-username"]}>{message.username}</span>
                            </div>
                        )}
                        <div className={styles["message-body"]}>
                            <div className={styles["message-content"]}>{message.message}</div>
                            {!isSystem && (
                                <span className={styles["message-timestamp"]}>{message.timestamp.toLocaleTimeString()}</span>
                            )}
                        </div>
                    </div>
                );  
            })}
        </div>

    <div className={styles["message-input"]}>
        <input
            type="text"
            placeholder="Enter recipient's username"
            value={toUser}
            onChange={(e) => setToUser(e.target.value)}
            className={styles.input}
        />
        <textarea
            placeholder="Type your message here"
            value={messageBox}
            onChange={(e) => setMessageBox(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.textarea}
        />
        <button
            className={styles["send-button"]}
            onClick={sendMessage}
            disabled={!messageBox || !toUser} // Disable if no message or recipient
        >Send</button>
    </div>

</div>

);
};

export default ChatArea;