import { useState } from 'react';
import { useGlobalContext } from './GlobalContext';

function UserAuth() {
    const { domain, port } = useGlobalContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRegister = async () => {
        const response = await fetch(`http://${domain}:${port}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Registration successful:', data.username);
        } else {
            console.error('Registration failed');
        }
    };

    const handleLogin = async () => {
            const response = await fetch(`http://${domain}:${port}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (response.ok) {
                const data = await response.json();
                document.cookie = `token=${data.token}`;
            } else {
                console.error('Login failed');
            }
        };


    return (
        <>
            <div className="user-auth">
                <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
                <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                <button onClick={handleRegister}>Register</button>
                <button onClick={handleLogin}>Login</button>
            </div>
        </>
    );
}

export default UserAuth;