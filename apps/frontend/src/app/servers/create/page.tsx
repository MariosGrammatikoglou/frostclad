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

    const handleCancel = () => {
        router.push('/servers');
    };

    return (
        <div className="window" style={{ maxWidth: 400, margin: "64px auto", padding: 24 }}>
            <div className="title-bar" style={{ paddingLeft: '8px', paddingTop: '4px', paddingBottom: '4px' }}><div className="title-bar-text">Create a Server</div></div>
            <div className="window-body">
                <form onSubmit={handleSubmit}>
                    <input
                        className="input"
                        placeholder="Server name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: "100%", marginBottom: 16 }}
                        maxLength={24}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="submit" className="button" style={{ minWidth: 90 }}>Create</button>
                        <button type="button" className="button" style={{ minWidth: 90 }} onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
