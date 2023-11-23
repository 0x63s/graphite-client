import React, { createContext, useContext, useState } from 'react';

interface GlobalContextType {
    domain: string;
    setDomain: (domain: string) => void;
    port: string;
    setPort: (port: string) => void;
    isConnected: boolean;
    setIsConnected: (isConnected: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [domain, setDomain] = useState('127.0.0.1'); // Default domain
    const [port, setPort] = useState('50001'); // Default port
    const [isConnected, setIsConnected] = useState(false);
    const [token, setToken] = useState(''); // Default cookie
    const [user_id, setUser_id] = useState(''); // Default username

    return (
        <GlobalContext.Provider value={{ domain, setDomain, port, setPort, isConnected, setIsConnected, token, setToken, user_id, setUser_id }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};
