'use client';

import Sidebar from '@/components/Sidebar';
import useAuth from '@/hooks/useAuth';

export default function ChannelsPage() {
    const { user } = useAuth();

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Welcome, {user?.username}</h1>
                <p>Select a channel to begin chatting.</p>
            </main>
        </div>
    );
}
