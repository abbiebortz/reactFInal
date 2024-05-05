import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Homepage.module.css';

function Homepage() {
    const navigate = useNavigate();
    const { setAuthenticated, setToken } = useAuth();  // Ensure setToken is used here correctly
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
    
            if (response.ok) {
                const data = await response.json();
                setAuthenticated(true);
                setToken(data.token);  // Assuming data.token is correctly provided by your backend
                navigate('/dashboard');
            } else {
                const text = await response.text();
                alert('Failed to log in. Please check your username and password. Error: ' + text);
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('An error occurred. Please try again later.');
        }
    };
    

    const goToSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Log In</button>
                </form>
                <button onClick={goToSignUp} className={styles.switchButton}>Need an account? Sign up.</button>
            </div>
        </div>
    );
}

export default Homepage;
