import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export interface User {
    id: string;
    email: string;
    username: string;
}

export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/me', {
                    withCredentials: true,
                });
                setUser(res.data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
}
