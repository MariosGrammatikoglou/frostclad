'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/axios';

interface ServerHeaderProps {
    onChannelCreated?: () => void;
}

export default function ServerHeader({ onChannelCreated }: ServerHeaderProps) {
    const { user } = useAuth();
    const { serverId } = useParams() as { serverId: string };
    const router = useRouter();

    const [server, setServer] = useState<{
        id: string;
        name: string;
        inviteCode: string;
        ownerId: string;
    } | null>(null);

    useEffect(() => {
        if (!serverId) return;

        const fetchServer = async () => {
            try {
                const res = await api.get(`/servers/${serverId}`, {
                    withCredentials: true,
                });
                setServer(res.data);
            } catch (err) {
                console.error('Failed to fetch server:', err);
            }
        };

        fetchServer();
    }, [serverId]);

    if (!server || !user) return null;

    const isOwner = user.id === server.ownerId;

    const handleCreateChannel = async () => {
        const name = prompt('Enter new channel name');
        if (!name) return;

        try {
            await api.post(`/channels/${serverId}`, {
                name,
                type: 'text',
            }, { withCredentials: true });

            if (onChannelCreated) onChannelCreated();
        } catch (err) {
            console.error('Failed to create channel:', err);
        }
    };

    return (
        <div className="flex justify-between items-center mb-4 text-white">
            <div>
                <h1 className="text-xl font-bold">{server.name}</h1>
                <p className="text-sm text-gray-400">Invite Code: {server.inviteCode || 'N/A'}</p>
            </div>
            {isOwner && (
                <button
                    onClick={handleCreateChannel}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Create Channel
                </button>
            )}
        </div>
    );
}
