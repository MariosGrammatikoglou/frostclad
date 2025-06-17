'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function CreateServerPage() {
    const [name, setName] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await api.post('/servers', { name }, { withCredentials: true });
            router.push(`/servers/${res.data.id}/channels`);
        } catch (err) {
            console.error('Server creation failed:', err);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="font-bold text-2xl mb-3 tracking-widest uppercase text-[#d4bc8a] drop-shadow-md font-serif">Create a Server</h1>
            <form onSubmit={handleSubmit}>
                <input
                    className="bg-[#ecd8b2] text-[#2e2518] border-2 border-[#ad8b46] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa36f]"
                    placeholder="Server name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit" className="bg-[#ad8b46] hover:bg-[#bfa36f] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow"
                >
                    Create
                </button>
            </form>
        </div>
    );
}
