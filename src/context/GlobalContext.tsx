import React, { createContext, useContext, useState } from 'react';

interface Message {
    id: number;
    content: string;
    sender: string;
}

interface Conversation {
    type: string;
    name: string;
    messages: Message[];
    timestamp: Date;
}

interface GlobalContextType {
    domain: string;
    setDomain: (domain: string) => void;
    port: string;
    setPort: (port: string) => void;
    isConnected: boolean;
    setIsConnected: (isConnected: boolean) => void;
    conversations: Conversation[];
    setConversations: (conversations: Conversation[]) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [domain, setDomain] = useState('127.0.0.1'); // Default domain
    const [port, setPort] = useState('50001'); // Default port
    const [isConnected, setIsConnected] = useState(false);
    const [token, setToken] = useState(''); // Default cookie
    const [user_id, setUser_id] = useState(''); // Default username
    const [conversations, setConversations] = useState<Conversation[]>([]);

    return (
        <GlobalContext.Provider
            value={{
                domain,
                setDomain,
                port,
                setPort,
                isConnected,
                setIsConnected,
                token,
                setToken,
                user_id,
                setUser_id,
                conversations,
                setConversations,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

//add a function which appends a message to the conversation list, the conversation name is passed as a parameter and the message, also the type of the conversation
const addMessageToConversation = (conversationName: string, message: Message, conversationType: string) => {
    //check if the conversation already exists
    const conversationIndex = conversations.findIndex((conversation) => conversation.name === conversationName);
    if (conversationIndex === -1) {
        //if it doesn't exist, create a new conversation
        const newConversation: Conversation = {
            type: conversationType,
            name: conversationName,
            messages: [message],
            timestamp: new Date(),
        };
        setConversations((prevConversations) => [...prevConversations, newConversation]);
    } else {
        //if it exists, add the message to the conversation
        setConversations((prevConversations) => {
            const newConversations = [...prevConversations];
            newConversations[conversationIndex].messages.push(message);
            return newConversations;
        });
    }
}


export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};
