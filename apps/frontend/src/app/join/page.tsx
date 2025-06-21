'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function JoinPage() {
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await api.post(`/servers/join/${inviteCode}`);
            router.push('/servers'); // Go to hub after joining
        } catch (err: any) {
            console.error(err);
            setError('Invalid or expired invite code');
        }
    };

    const handleCancel = () => {
        router.push('/servers');
    };

    return (
        <div className="window" style={{
            maxWidth: 400, margin: "18rem auto", padding: 24
        }}>
            <div className="title-bar" style={{ paddingLeft: '8px', paddingTop: '4px', paddingBottom: '4px' }}><div className="title-bar-text">Join a Server</div></div>
            <div className="window-body">
                <form onSubmit={handleJoin}>
                    <input
                        type="text"
                        placeholder="Enter Invite Code"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="input"
                        required
                        style={{ width: "100%", marginBottom: 16 }}
                    />
                    {error && <p style={{ color: "#c00", marginBottom: 12 }}>{error}</p>}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="submit" className="button" style={{ minWidth: 90 }}>Join</button>
                        <button type="button" className="button" style={{ minWidth: 90 }} onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div >
    );
}
