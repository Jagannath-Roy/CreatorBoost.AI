import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    // Try to fetch current user to ensure cookie is still valid
                    const { data } = await api.get('/auth/me');
                    setUser(data.data);
                } catch (error) {
                    // If it fails (e.g. 401), the interceptor in api.js will handle clearing local storage and redirecting
                    setUser(null);
                }
            }
            setLoading(false);
        };
        verifySession();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data.data.user);
        localStorage.setItem('user', JSON.stringify(data.data.user));
    };

    const register = async (name, email, password) => {
        await api.post('/auth/register', { name, email, password });
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
