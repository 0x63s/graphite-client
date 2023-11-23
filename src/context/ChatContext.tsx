import React, { createContext, useContext, useState } from 'react';

interface MessageType {
    //id: string; // Unique identifier for the message
    timestamp?: Date; // Optional timestamp of when the message was sent
    username: string; // Username of the sender
    message: string; // The message content
  }

interface ChatContextType {
    messages: MessageType[]; // Define MessageType according to your needs
    addMessage: (message: MessageType) => void;
  }
  
  const ChatContext = createContext<ChatContextType | undefined>(undefined);
  

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
      throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
  };
  
