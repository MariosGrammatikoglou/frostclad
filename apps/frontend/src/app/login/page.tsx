'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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
            const res = await api.post('/auth/login', form);
            Cookies.set('token', res.data.token); // store JWT
            router.push('/'); // redirect to home
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="m-auto w-full max-w-md p-4">
            <h1 className="font-bold text-2xl mb-3 tracking-widest uppercase text-[#d4bc8a] drop-shadow-md font-serif">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="bg-[#ecd8b2] text-[#2e2518] border-2 border-[#ad8b46] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa36f]" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="bg-[#ecd8b2] text-[#2e2518] border-2 border-[#ad8b46] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa36f]" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="bg-[#ad8b46] hover:bg-[#bfa36f] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow">Login</button>
            </form>
        </div>
    );
}
