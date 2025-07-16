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
        <div className="page-container"> {/* Parent div for centering */}
            <div className="login-container">
                {/* Frostclad Gate and Login Title inside the same div */}
                <div className="title-container">
                    <h1 className="frostclad-title">Frostclad Gate</h1>
                    <h2 className="login-title">Login</h2>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-actions">
                        <button type="submit" className="btn">Login</button>
                    </div>
                </form>

                {/* Small text with a link to register */}
                <div className="register-link">
                    <p className="register-text">
                        Don't have an account? <a href="/register" className="register-link-text">Register here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
