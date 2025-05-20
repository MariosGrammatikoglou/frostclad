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
            <h1 className="text-xl font-bold mb-4">Create a Server</h1>
            <form onSubmit={handleSubmit}>
                <input
                    className="w-full p-2 border mb-4 rounded"
                    placeholder="Server name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create
                </button>
            </form>
        </div>
    );
}
