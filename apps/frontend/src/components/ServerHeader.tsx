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
        api.get(`/servers/${serverId}`, { withCredentials: true })
            .then(res => setServer(res.data))
            .catch(err => console.error('Failed to fetch server:', err));
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
        <div style={{ marginBottom: 10 }}>
            <div style={{ width: "100%" }}>
                <div className="title-bar">
                    <div className="title-bar-text">{server.name}</div>
                </div>
                <div className="window-body" style={{ fontSize: 14 }}>
                    <div style={{ marginBottom: 8 }}>
                        <b>Invite Code:</b> <span style={{ fontFamily: "monospace" }}>{server.inviteCode}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        {isOwner ? (
                            <>
                                <button className="button" onClick={() => setShowCreateModal(true)}>+ Create Channel</button>
                                <CreateChannelModal
                                    isOpen={showCreateModal}
                                    onClose={() => setShowCreateModal(false)}
                                    onSubmit={handleCreateChannel}
                                />
                            </>
                        ) : (
                            <>
                                <button className="button" onClick={() => setShowLeaveModal(true)}>Leave Server</button>
                                <LeaveServerModal
                                    isOpen={showLeaveModal}
                                    onClose={() => setShowLeaveModal(false)}
                                    onConfirm={handleLeaveServer}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
