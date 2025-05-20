'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Channel {
    id: string;
    name: string;
    type: string;
}

export default function Sidebar() {
    const router = useRouter();
    const { serverId, channelId } = useParams() as { serverId: string; channelId?: string };
    const [channels, setChannels] = useState<Channel[]>([]);

    useEffect(() => {
        if (!serverId) return;

        const fetchChannels = async () => {
            try {
                const res = await api.get(`/channels/server/${serverId}`, {
                    withCredentials: true,
                });
                setChannels(res.data.filter((ch: Channel) => ch.type === 'text'));
            } catch (err) {
                console.error('Failed to fetch channels:', err);
            }
        };

        fetchChannels();
    }, [serverId]);

    const handleClick = (id: string) => {
        router.push(`/servers/${serverId}/channels/${id}`);
    };

    return (
        <div className="w-64 bg-gray-900 text-white p-4 space-y-2">
            <h2 className="text-lg font-bold mb-2">Text Channels</h2>
            {channels.map((channel) => (
                <button
                    key={channel.id}
                    onClick={() => handleClick(channel.id)}
                    className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-700 ${channel.id === channelId ? 'bg-gray-700' : ''
                        }`}
                >
                    # {channel.name}
                </button>
            ))}
        </div>
    );
}
