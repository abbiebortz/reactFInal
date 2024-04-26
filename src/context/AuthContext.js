import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({ isAuthenticated: false, token: null });

    const setAuthenticated = (isAuthenticated, token) => {
        if (isAuthenticated) {
            localStorage.setItem('token', token);  // Save token to localStorage
            setAuthData({ isAuthenticated, token });
        } else {
            localStorage.removeItem('token');  // Clear token from localStorage
            setAuthData({ isAuthenticated: false, token: null });
        }
    };

    const setToken = (token) => {  // Define setToken to update only the token in authData
        if (token) {
            localStorage.setItem('token', token);
            setAuthData(prevData => ({ ...prevData, token }));
        } else {
            localStorage.removeItem('token');
            setAuthData(prevData => ({ ...prevData, token: null }));
        }
    };

    return (
        <AuthContext.Provider value={{ ...authData, setAuthenticated, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
