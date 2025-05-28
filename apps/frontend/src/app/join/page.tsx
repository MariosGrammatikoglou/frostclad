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
            <h1 className="text-2xl font-bold mb-4">Join a Server</h1>

            <form onSubmit={handleJoin} className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Enter Invite Code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="p-2 border rounded text-black"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Join
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>

            {/* Back to Hub Button */}
            <button
                onClick={() => router.push('/servers')}
                className="mt-6 text-sm text-gray-400 hover:underline"
            >
                ← Back to Server Hub
            </button>
        </div>
    );
}
