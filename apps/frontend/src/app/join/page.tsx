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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="font-bold text-2xl mb-3 tracking-widest uppercase text-[#d4bc8a] drop-shadow-md font-serif">Join a Server</h1>

            <form onSubmit={handleJoin} className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Enter Invite Code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="bg-[#ecd8b2] text-[#2e2518] border-2 border-[#ad8b46] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa36f]"
                />
                <button type="submit" className="bg-[#ad8b46] hover:bg-[#bfa36f] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow">
                    Join
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>

            {/* Back to Hub Button */}
            <button
                onClick={() => router.push('/servers')}
                className="bg-[#ad8b46] hover:bg-[#bfa36f] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow"
            >
                ← Back to Server Hub
            </button>
        </div>
    );
}
