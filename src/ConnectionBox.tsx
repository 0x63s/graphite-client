// src/ConnectionBox.tsx

import React from 'react';
import { useGlobalContext } from './GlobalContext';

const ConnectionBox: React.FC = () => {
    const { domain, setDomain, port, setPort } = useGlobalContext();

    const handleDomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(event.target.value);
    };

    const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPort(event.target.value);
    };

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
        </div>
    );
};

export default ConnectionBox;
