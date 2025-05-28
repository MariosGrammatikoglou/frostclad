'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/axios';
import CreateChannelModal from './CreateChannelModal';

interface ServerHeaderProps {
    onChannelCreated?: () => void;
}

export default function ServerHeader({ onChannelCreated }: ServerHeaderProps) {
    const { user } = useAuth();
    const router = useRouter();
    const { serverId } = useParams() as { serverId: string };

    const [server, setServer] = useState<{
        id: string;
        name: string;
        inviteCode: string | null;
        ownerId: string;
    } | null>(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

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

    const handleCreateChannel = async (name: string) => {
        if (!name) return;
        try {
            await api.post(
                `/channels/${serverId}`,
                {
                    name,
                    type: 'text',
                },
                { withCredentials: true }
            );
            onChannelCreated?.();
            setShowCreateModal(false); // ✅ Close modal on success
        } catch (err) {
            console.error('Failed to create channel:', err);
        }
    };

    const handleLeaveServer = async () => {
        try {
            await api.delete(`/servers/${serverId}/leave`, {
                withCredentials: true,
            });
            router.push('/servers');
        } catch (err) {
            console.error('Failed to leave server:', err);
        }
    };

    return (
        <div className="flex justify-between items-center mb-4 text-white">
            <div>
                <h1 className="text-xl font-bold">{server.name}</h1>
                <p className="text-sm text-gray-400">
                    Invite Code: {server.inviteCode}
                </p>
            </div>
            <div className="flex gap-2">
                {isOwner ? (
                    <>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                        >
                            + Create Channel
                        </button>
                        <CreateChannelModal
                            isOpen={showCreateModal}
                            onClose={() => setShowCreateModal(false)}
                            onSubmit={handleCreateChannel}
                        />
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setShowLeaveModal(true)}
                            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                        >
                            Leave Server
                        </button>
                        {showLeaveModal && (
                            <div className="absolute top-20 right-8 bg-gray-800 p-4 rounded shadow-md z-50">
                                <p className="mb-2">Are you sure you want to leave?</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleLeaveServer}
                                        className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                                    >
                                        Leave
                                    </button>
                                    <button
                                        onClick={() => setShowLeaveModal(false)}
                                        className="bg-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
