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
            alert('Server creation failed!');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <div className="window" style={{ minWidth: 320, maxWidth: 400 }}>
                <div className="title-bar">
                    <div className="title-bar-text">Create a Server</div>
                </div>
                <div className="window-body">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <label htmlFor="serverName">Server name:</label>
                        <input
                            id="serverName"
                            className="input"
                            placeholder="My server"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ marginBottom: 16 }}
                        />
                        <button type="submit" className="button">Create</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
