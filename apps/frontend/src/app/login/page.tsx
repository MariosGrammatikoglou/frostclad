'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import '../stylescss/stylelogin.css';

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
        <div className="outer-container">
            <div className="login-container">
                <div className="title-container">
                    <div className="frostclad-title">Frostclad Gate</div>
                    <div className="login-text">Login</div> {/* Added Login text here */}
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
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
                        <div className="input-container">
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
                        {error && (
                            <div className="error-message">
                                <p>{error}</p>
                            </div>
                        )}
                        <div className="button-container">
                            <button type="submit" className="submit-button">Login</button>
                            <button
                                type="button"
                                className="register-button"
                                onClick={() => router.push('/register')}
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
