'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Sidebar from '@/components/Sidebar';
import ServerHeader from '@/components/ServerHeader';
import MessagePanel from '@/components/MessagePanel';
import api from '@/lib/axios';

interface Channel {
    id: string;
    name: string;
    type: string;
}

export default function ServerChannelsPage() {
    const { user, loading } = useAuth();
    const { serverId } = useParams() as { serverId: string };
    const router = useRouter();

    const [channels, setChannels] = useState<Channel[]>([]);
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [loading, user]);

    const fetchChannels = async () => {
        try {
            const res = await api.get(`/channels/server/${serverId}`, {
                withCredentials: true,
            });

            setChannels(res.data);

            if (!activeChannel && res.data.length > 0) {
                const defaultChannel = res.data.find((ch: Channel) => ch.name === 'general') || res.data[0];
                setActiveChannel(defaultChannel);
            }
        } catch (err) {
            console.error('Failed to load channels:', err);
        }
    };

    useEffect(() => {
        if (serverId) {
            fetchChannels();
        }
    }, [serverId]);

    if (!activeChannel) return <div className="text-white p-4">Loading channels...</div>;

    return (
        <div className="flex h-screen">
            <Sidebar />
            {/* Left: Server-specific channel list */}
            <div className="w-64 bg-gray-900 p-4 text-white">
                <h2 className="font-bold mb-2">Channels</h2>
                {channels.map((channel) => (
                    <button
                        key={channel.id}
                        onClick={() => setActiveChannel(channel)}
                        className={`block w-full text-left px-3 py-2 rounded mb-1 ${activeChannel.id === channel.id ? 'bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                    >
                        #{channel.name}
                    </button>
                ))}
            </div>

            {/* Right: Main content */}
            <main className="flex-1 p-6 flex flex-col">
                <ServerHeader onChannelCreated={fetchChannels} />
                <MessagePanel channelId={activeChannel.id} />
            </main>
        </div>
    );
}
