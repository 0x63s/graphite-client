import { useState } from 'react';
import { useGlobalContext } from './GlobalContext';

function UserAuth() {
    const { domain, port, isConnected, token, setToken, user_id, setUser_id } = useGlobalContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRegister = async () => {
        if(!isConnected) {
            console.log("Not connected");
            return;
        }
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

    //function to enable the user to login
    

    const handleLogin = async () => {
        if(!isConnected) {
            console.log("Not connected");
            return;
        }
        console.log("Logging in");
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
                setToken(data.token);
                setUser_id(username);
                console.log('Login successful:', data.token);
            } else {
                console.error('Login failed');
            }
        };


    return (
        <>
            <div className="user-auth">
            <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={handleUsernameChange} 
                    disabled={!isConnected} // Disable if not connected
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={handlePasswordChange} 
                    disabled={!isConnected} // Disable if not connected
                />
                <button onClick={handleRegister} disabled={!isConnected}>Register</button>
                <button onClick={handleLogin} disabled={!isConnected}>Login</button>
            </div>
        </>
    );
}

export default UserAuth;