'use client';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/axios';
import useAuth from '@/hooks/useAuth';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

interface Server {
    id: string;
    name: string;
}

export default function ServerHubPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    const { data: servers, error, isLoading } = useSWR<Server[]>('/servers', async () => {
        const res = await api.get('/servers', { withCredentials: true });
        return res.data;
    });

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/login');
    };

    if (loading || isLoading)
        return <div className="window p-4">Loading Frostclad...</div>;
    if (error)
        return <div className="window alert alert-error p-4">Failed to load servers</div>;
    if (!user) return null;

    return (
        <div className="window" style={{ minWidth: 400, maxWidth: 520, margin: "32px auto", padding: 24 }}>
            <div className="title-bar">
                <div className="title-bar-text">Frostclad Server Hub</div>
                <div className="title-bar-controls">
                    <button aria-label="Close" onClick={handleLogout} />
                </div>
            </div>
            <div className="window-body">
                <h1 style={{
                    fontSize: 20,
                    marginBottom: 14,
                    color: "#222",
                    fontWeight: 700,
                    fontFamily: '"MS Sans Serif", Tahoma, Arial, sans-serif'
                }}>
                    Welcome, {user.username}
                </h1>

                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <button
                        className="button"
                        style={{ minWidth: 100 }}
                        onClick={() => router.push('/servers/create')}
                    >
                        🛠 Create Server
                    </button>
                    <button
                        className="button"
                        style={{ minWidth: 100 }}
                        onClick={() => router.push('/join')}
                    >
                        🔑 Join Server
                    </button>
                </div>

                <fieldset style={{ marginBottom: 16 }}>
                    <legend>Your Servers</legend>
                    {servers?.length === 0 ? (
                        <div style={{ color: "#888", marginTop: 10 }}>You haven’t joined any servers yet.</div>
                    ) : (
                        <ul style={{ paddingLeft: 0, margin: 0 }}>
                            {servers?.map((server) => (
                                <li key={server.id} style={{ listStyle: 'none', marginBottom: 8 }}>
                                    <button
                                        className="button"
                                        style={{ width: "100%", textAlign: "left", padding: "6px 10px" }}
                                        onClick={() => router.push(`/servers/${server.id}/channels`)}
                                    >
                                        🖥️ {server.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </fieldset>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className="button"
                        style={{ minWidth: 90 }}
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
