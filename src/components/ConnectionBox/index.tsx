import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { useChatContext } from '../../context/ChatContext';

const ConnectionBox: React.FC = () => {
    const { domain, setDomain, port, setPort, isConnected, setIsConnected } = useGlobalContext();
    const [isOnline, setIsOnline] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [disablechecking, setDisablechecking] = useState(false);
    const [isCheckingThreadRunning, setIsCheckingThreadRunning] = useState(false);
    const { addMessage } = useChatContext();

    const handleDomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(event.target.value);
    };

    const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPort(event.target.value);
    };

    const triggerConnectionCheck = async () => {

        //This is here to disable the checking button while the check is running
        if (!disablechecking) {
            //console.log("disablechecking is false");
            setIsChecking(true);
        }
        
        try {
            const response = await fetch(`http://${domain}:${port}/ping`, {
                method: 'GET',
                headers: {
                    //'Cache-Control': 'no-cache', // Tells the browser not to use a cached version
                    //'Pragma': 'no-cache'
                }
            });

            const data = await response.json();

            if (data.ping) {
                setIsOnline(true);
                setIsConnected(true); // Set isConnected here
                // console.log('Connected to server');
                startCheckThread();

                //checks if the thread is running, if not, send a message
                if(!isCheckingThreadRunning){
                    sendConSuccessMsg();
                }

            } else {
                setIsOnline(false);
                setIsConnected(false); // Set isConnected here
                // console.error('Failed to connect to server');
                stopCheckThread();
                sendErrConMsg();
            }

        } catch (error) {
            //handle net::ERR_CONNECTION_REFUSED error
            if(error.message === "Failed to fetch") {
                sendErrConMsg();
            }

            setIsOnline(false);
            setIsConnected(false);
            //console.error('Failed to connect to server:', error);
            stopCheckThread();
        }

        //This is here to disable the checking button while the check is running
        if(!disablechecking) {
            setIsChecking(false);
        }

        setIsConnected(isOnline);
    };

    const sendErrConMsg = () => {
            addMessage({
                username: 'System',
                message: `Couldn't connect to server ${domain}:${port}`,
                timestamp: new Date(),
            });
    }

    const sendConSuccessMsg = () => {
            addMessage({
                username: 'System',
                message: `Connected to server ${domain}:${port}`,
                timestamp: new Date(),
            });
    }


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
            <button onClick={triggerConnectionCheck} disabled={isOnline}>
                {isChecking ? 'Checking...' : 'Check'}
            </button>
            <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
        </div>
    );
};

export default ConnectionBox;
