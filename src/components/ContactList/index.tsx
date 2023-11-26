import { useState, useEffect } from "react";
import { useGlobalContext } from '../../context/GlobalContext';
import styles from "./ContactList.module.css";
import { Store } from 'react-notifications-component';

function ContactList() {
    const [contactList, setContactList] = useState([]);
    const [selectedContactIndex, setSelectedContactIndex] = useState(); // New state for tracking selected contact
    const [newConversationUsername, setNewConversationUsername] = useState(""); // New state for new conversation username
    const { domain, port, isConnected, token, conversations, setConversations } = useGlobalContext();


    const handleRadioChange = (index) => {
        setSelectedContactIndex(index); // Now using the setSelectedContactIndex function
    };

    const handleAddConversation = () => {
        //if user is onlin
        if (isUserOnline(newConversationUsername) == false) {    
            if (newConversationUsername.trim() !== "") {
                createConversation(newConversationUsername, "user");
                setNewConversationUsername(""); // Clear input after adding
            } else {
                // You might want to show an error or a notification here
                Store.addNotification({
                    title: "Error",
                    message: "Username cannot be empty",
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
            }
        } else{
            console.log("User is not online")
            Store.addNotification({
                title: "Error",
                message: "User is not online",
                type: "danger",
                insert: "top",
                container: "top-right",
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        }
    };

    const isUserOnline = async (username: string) => {
        try {
            const response = await fetch(`http://${domain}:${port}/user/online`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, username }),
            });
            const data = await response.json();
            if (data.Error) {
                console.error("Error:", data.Error);
                return false;
            } else {
                return data.online;
            }
        } catch (error) {
            console.error("Error:", error);
            return false;
        }
    };
    
    const handleUsernameChange = (event) => {
        setNewConversationUsername(event.target.value);
    };

    //make a function to create a conversation if it doesn't exist
    const createConversation = (conversationName: string, conversationType: string) => {
        //check if the conversation already exists
        const conversationIndex = conversations.findIndex((conversation) => conversation.name === conversationName);
        if (conversationIndex === -1) {
            //if it doesn't exist, create a new conversation
            const newConversation: Conversation = {
                type: conversationType,
                name: conversationName,
                messages: [],
                timestamp: new Date(),
            };
            setConversations((prevConversations) => [...prevConversations, newConversation]);
        }
    };

    return (
        <div className={styles["contact-list"]}>
            <ul>
                {conversations.map((conversation, index) => (
                    <li key={index} className={styles["contact-item"]}>
                        <input
                            id={`contact-${index}`}
                            type="radio"
                            name="contact"
                            value={index}
                            checked={index === selectedContactIndex} // Mark the radio as checked based on state
                            onChange={() => handleRadioChange(index)}
                            className={styles["contact-radio"]}
                        />
                        <label htmlFor={`contact-${index}`} className={styles["contact-label"]}>
                            {conversation.name}
                        </label>
                    </li>
                ))}
            </ul>
            <div className={styles["add-conversation"]}> {/* Add a class for this div if you have specific styles */}
                <input
                    type="text"
                    value={newConversationUsername}
                    onChange={handleUsernameChange}
                    className={styles["new-conversation-username"]} // Add class for input if needed
                    placeholder="Enter username"
                />
                <button onClick={handleAddConversation} className={styles["add-conversation-button"]}> {/* Add class for button if needed */}
                    Add Conversation
                </button>
            </div>
        </div>
    );
}

export default ContactList;