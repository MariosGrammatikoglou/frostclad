'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', form);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="m-auto w-full max-w-md p-4">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700">Register</button>
            </form>
        </div>
    );
}
