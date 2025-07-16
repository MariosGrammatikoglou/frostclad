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
        <div className="login-container">
            <div className="card">
                <h2 className="title">Frostclad Gate</h2>
                <p className="login-label">Login</p>  {/* Login label added here */}
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="email" className="label">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="label">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </div>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <div className="button-group">
                        <button type="submit" className="btn-primary">Login</button>
                    </div>
                    <div className="register-prompt">
                        <span>Don’t have an account?</span>
                        <button
                            type="button"
                            onClick={() => router.push('/register')}
                            className="btn-link"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
