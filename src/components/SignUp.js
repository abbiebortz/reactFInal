import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './SignUp.module.css';

function SignUp() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/signup', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

            if (response.ok) {
                alert('Account created successfully. Please log in.');  // Inform user to log in manually
                navigate('/');  // Removed auto-redirect to login page
            } else {
                const text = await response.text();  
                alert('Failed to sign up: ' + text);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Failed to fetch. Check console for more details.');
        }
    };
    
    return (
        <div className={styles.signupContainer}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp} className={styles.signupForm}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.signupInput}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.signupInput}
                />
                <button type="submit" className={styles.button}>Sign Up</button>
            </form>
            <p className={styles.loginLinkText}>
                Already have an account? <Link to="/" className={styles.loginLink}>Log in here.</Link>
            </p>
        </div>
    );
}

export default SignUp;
