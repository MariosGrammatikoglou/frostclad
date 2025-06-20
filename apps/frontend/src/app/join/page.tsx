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
            router.push('/servers');
        } catch (err: any) {
            setError('Invalid or expired invite code');
        }
    };

    return (
        <div className="window" style={{ width: 350, margin: "4rem auto", minHeight: 340 }}>
            <div className="title-bar">
                <div className="title-bar-text">Join a Server</div>
            </div>
            <div className="window-body">
                <form onSubmit={handleJoin}>
                    <div className="field-row-stacked" style={{ marginBottom: 12 }}>
                        <label htmlFor="inviteCode">Invite Code</label>
                        <input
                            id="inviteCode"
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            className="input"
                            autoComplete="off"
                            required
                        />
                    </div>
                    {error && <div className="status-bar status-bar--error" style={{ marginBottom: 8 }}>
                        <p>{error}</p>
                    </div>}
                    <div className="field-row" style={{ justifyContent: "space-between" }}>
                        <button type="submit" className="button">Join</button>
                        <button
                            type="button"
                            className="button"
                            onClick={() => router.push('/servers')}
                        >← Back to Hub</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
