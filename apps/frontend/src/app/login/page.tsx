'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/login', form);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="window" style={{ width: 350, margin: "4rem auto" }}>
            <div className="title-bar" style={{ paddingLeft: '8px', paddingTop: '4px', paddingBottom: '4px' }}>
                <div className="title-bar-text">Login</div>
            </div>
            <div className="window-body">
                <form onSubmit={handleSubmit}>
                    <div className="field-row-stacked">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="field-row-stacked" style={{ marginTop: 8 }}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <div className="status-bar status-bar--error" style={{ margin: "8px 0" }}>
                        <p>{error}</p>
                    </div>}
                    <div className="field-row" style={{ marginTop: 14 }}>
                        <button type="submit" className="button">Login</button>
                        <button
                            type="button"
                            className="button"
                            onClick={() => router.push('/register')}
                        >Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
