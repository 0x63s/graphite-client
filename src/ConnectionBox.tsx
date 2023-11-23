import React, { useState, useEffect } from 'react';
import { useGlobalContext } from './GlobalContext';

const ConnectionBox: React.FC = () => {
    const { domain, setDomain, port, setPort, isConnected, setIsConnected } = useGlobalContext();
    const [isOnline, setIsOnline] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [disablechecking, setDisablechecking] = useState(false);

    const handleDomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(event.target.value);
    };

    const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPort(event.target.value);
    };

    const triggerConnectionCheck = async () => {
        if (!disablechecking) {
            console.log("disablecheking is false");
            setIsChecking(true);
        }
        setIsOnline(false);
        try {
            const response = await fetch(`http://${domain}:${port}/ping`, {
                method: 'GET',
                headers: {
                    //'Cache-Control': 'no-cache', // Tells the browser not to use a cached version
                    //'Pragma': 'no-cache'
                }
            });

            if (response.status === 200) {
                setIsOnline(true);
                //console.log('Connected to server');
                startCheckThread();
            } else {
                setIsOnline(false);
                //console.error('Failed to connect to server');
                stopCheckThread();
            }
        } catch (error) {
            setIsOnline(false);
            //console.error('Failed to connect to server:', error);
            stopCheckThread();
        }
        if(!disablechecking) {
            setIsChecking(false);
        }
        setIsConnected(isOnline);
    };

    const [isCheckingThreadRunning, setIsCheckingThreadRunning] = useState(false);

    const startCheckThread = () => {
        setDisablechecking(true);
        setIsCheckingThreadRunning(true);
    };

    const stopCheckThread = () => {
        setDisablechecking(false);
        setIsCheckingThreadRunning(false);
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            if (isCheckingThreadRunning) {
                triggerConnectionCheck();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [domain, port, isCheckingThreadRunning]);

    return (
        <div>
            <label htmlFor="domain">Domain: </label>
            <input
                id="domain"
                type="text"
                value={domain}
                onChange={handleDomainChange}
            />
            <label htmlFor="port">Port: </label>
            <input
                id="port"
                type="text"
                value={port}
                onChange={handlePortChange}
            />
            <button onClick={triggerConnectionCheck} disabled={isChecking}>
                {isChecking ? 'Checking...' : 'Check'}
            </button>
            <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
        </div>
    );
};

export default ConnectionBox;
