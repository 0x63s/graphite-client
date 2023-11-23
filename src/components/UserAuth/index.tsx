import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { useChatContext } from '../../context/ChatContext';

function UserAuth() {
    const { domain, port, isConnected, setIsConnected, token, setToken, user_id, setUser_id } = useGlobalContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { addMessage } = useChatContext();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRegister = async () => {
        if(token !== "") {
            addMessage({
                username: 'System',
                message: 'Error Registration failed: Already logged in',
                timestamp: new Date(),
            });
            return;
        }
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
            if(data.Error === "Username already in use") {
                addMessage({
                    username: 'System',
                    message: 'Error Registration failed: ' + data.Error,
                    timestamp: new Date(),
                });
                return;
            } 
            if(data.username === username){
                console.log('Registration successful:', data.username);
                addMessage({
                    username: 'System',
                    message: `Registration successful: ${data.username}`,
                    timestamp: new Date(),
                });
                handleLogin();
            } else{
                addMessage({
                    username: 'System',
                    message: 'Registration failed',
                    timestamp: new Date(),
                });
            }

        } else {
            console.error('Registration failed');
            addMessage({
                username: 'System',
                message: 'Registration failed',
                timestamp: new Date(),
            });
        }
    };
    

    const handleLogin = async () => {
        if(token !== "") {
            //here we are checking why the user wants to login again even though they are already logged in
            const response = await fetch(`http://${domain}:${port}/user/online`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //this is a messy way to do it, but it works and is universally applicable
                body: JSON.stringify({ token: token, username: "1398ubf219v192dc8h2197h9dh10d8hfub2vp9ub" }),
            });
            const data = await response.json();
            console.log(data)
            if(data.online){
                addMessage({
                    username: 'System',
                    message: `Error: Already logged in`,
                    timestamp: new Date(),
                });
                return;
            }
            if(data.Error === 'Invalid parameters'){
                addMessage({
                    username: 'System',
                    message: `Login Failed: ${data.Error}`,
                    timestamp: new Date(),
                });
                return;
            }
        }

        if(!isConnected) {
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
                console.log(data);
                if(data.token != null){
                    setToken(data.token);
                    setUser_id(username);
                    console.log('Login successful:', data.token);
                    addMessage({
                        username: 'System',
                        message: `Login successful: ${data.token}`,
                        timestamp: new Date(),
                    });
                } else{
                    addMessage({
                        username: 'System',
                        message: 'Login failed! ' + data.Error,
                        timestamp: new Date(),
                    });
                }
            } else {
                console.error('Login failed');
                addMessage({
                    username: 'System',
                    message: 'Login failed',
                    timestamp: new Date(),
                });
            }
        };

    const handleLogout = async () => {

        console.log(token);

        if(token === "") {
            addMessage({
                username: 'System',
                message: 'Error: Not logged in',
                timestamp: new Date(),
            });
            return;
        }
        if(!isConnected) {
            return;
        }
        console.log("Logging out");
            const response = await fetch(`http://${domain}:${port}/user/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token
                })
            });

            if (response.ok) {
                const data = await response.json();
                if(data.logout){
                    setToken("");
                    setUser_id("");
                    console.log('Logout successful:', data.logout);
                    addMessage({
                        username: 'System',
                        message: `Logout successful: ${data.logout}`,
                        timestamp: new Date(),
                    });
                }
            } else {
                console.error('Logout failed');
                addMessage({
                    username: 'System',
                    message: 'Logout failed',
                    timestamp: new Date(),
                });
            }
        }


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
                <button onClick={handleRegister} disabled={(!isConnected && (token === null))}>Register</button>
                <button onClick={handleLogin} disabled={(!isConnected && (token === null))}>Login</button>
                <button onClick={handleLogout} disabled={(!isConnected && (token.length > 0))}>Logout</button>
            </div>
        </>
    );
}

export default UserAuth;