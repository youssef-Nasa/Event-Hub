import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchCurrentUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const { data } = await API.get('/auth/me');
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await API.post('/auth/logout');
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    // Helper to check if user has a specific permission
    const hasPermission = (permission) => {
        return user?.permissions?.includes(permission) || user?.role === "Admin";
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading, hasPermission }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
