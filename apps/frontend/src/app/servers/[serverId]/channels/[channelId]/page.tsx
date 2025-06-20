'use client';

import ServerHeader from '@/components/ServerHeader';
import MessagePanel from '@/components/MessagePanel';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/axios';

interface Channel { id: string; name: string; type: string; }

export default function ChannelPage() {
    const { user, loading } = useAuth();
    const { serverId, channelId } = useParams() as { serverId: string; channelId: string };
    const router = useRouter();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [loading, user]);

    useEffect(() => {
        async function fetchChannels() {
            const res = await api.get(`/channels/server/${serverId}`, { withCredentials: true });
            setChannels(res.data);
            const found = res.data.find((ch: Channel) => ch.id === channelId);
            setActiveChannel(found || res.data[0]);
        }
        if (serverId && channelId) fetchChannels();
    }, [serverId, channelId]);

    return (
        <div className="window" style={{ margin: 24, flex: 1, minHeight: 400 }}>
            <div className="title-bar">
                <div className="title-bar-text">
                    {activeChannel?.name ? `#${activeChannel.name}` : "Loading..."}
                </div>
            </div>
            <div className="window-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: 16 }}>
                    <ServerHeader onChannelCreated={() => { }} />
                </div>
                <div style={{ flex: 1, minHeight: 250 }}>
                    {!activeChannel ? (
                        <div style={{ textAlign: 'center', color: "#333", padding: 16 }}>
                            Loading channel...
                        </div>
                    ) : (
                        <MessagePanel channelId={activeChannel.id} />
                    )}
                </div>
            </div>
        </div>
    );
}
