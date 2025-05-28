'use client';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/axios';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';

interface Server {
    id: string;
    name: string;
}

export default function ServerHubPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    // ✅ Redirect to /login if user is not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    const { data: servers, error, isLoading } = useSWR<Server[]>('/servers', async () => {
        const res = await api.get('/servers', { withCredentials: true });
        return res.data;
    });

    if (loading || isLoading) return <div className="p-4 text-white">Loading Frostclad...</div>;
    if (error) return <div className="p-4 text-red-500">Failed to load servers</div>;
    if (!user) return null;

    return (
        <div className="p-4 text-white">
            <h1 className="text-xl font-bold mb-4">Welcome, {user.username}</h1>

            <div className="mb-6">
                <button
                    onClick={() => router.push('/servers/create')}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-4"
                >
                    Create Server
                </button>
                <button
                    onClick={() => router.push('/join')}
                    className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
                >
                    Join Server
                </button>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Your Servers</h2>
                {servers?.length === 0 ? (
                    <p className="text-gray-400">You haven’t joined any servers yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {servers?.map((server) => (
                            <li key={server.id}>
                                <button
                                    onClick={() => router.push(`/servers/${server.id}/channels`)
                                    }
                                    className="text-left bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded w-full"
                                >
                                    {server.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

            </div>
        </div>
    );
}
