'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

interface User {
    id: string;
    email: string;
    username: string;
}

interface AuthContextProps {
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) return setLoading(false);

        api
            .get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setUser(res.data.user))
            .catch(() => Cookies.remove('token'))
            .finally(() => setLoading(false));
    }, []);

    const login = (token: string) => {
        Cookies.set('token', token);
        api
            .get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setUser(res.data.user));
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
