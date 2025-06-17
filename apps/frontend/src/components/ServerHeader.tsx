'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/axios';
import CreateChannelModal from './CreateChannelModal';
import LeaveServerModal from './LeaveServerModal';

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
                { name, type: 'text' },
                { withCredentials: true }
            );
            onChannelCreated?.();
            setShowCreateModal(false);
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
        <div className="flex justify-between items-center mb-4 font-serif">
            <div>
                <h1 className="font-bold text-2xl mb-2 tracking-widest uppercase text-[#bfa36f] drop-shadow-md">{server.name}</h1>
                <p className="text-sm text-[#7c5b27]">
                    Invite Code: <span className="font-mono">{server.inviteCode}</span>
                </p>
            </div>
            <div className="flex gap-2">
                {isOwner ? (
                    <>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-[#ad8b46] hover:bg-[#bfa36f] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow transition"
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
                            className="bg-[#ad8b46] hover:bg-[#bfa36f] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow transition"
                        >
                            Leave Server
                        </button>
                        <LeaveServerModal
                            isOpen={showLeaveModal}
                            onClose={() => setShowLeaveModal(false)}
                            onConfirm={handleLeaveServer}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
