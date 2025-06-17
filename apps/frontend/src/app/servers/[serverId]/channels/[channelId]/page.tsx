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
        <>
            {/* Server Header */}
            <div className="px-8 pt-5 pb-2 shrink-0">
                <ServerHeader onChannelCreated={() => { }} />
            </div>
            {/* Chat container */}
            <div className="flex-1 flex flex-col min-h-0 min-w-0 px-4 pb-6">
                {!activeChannel ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="border-4 border-[#bfa36f] rounded-2xl shadow-2xl bg-[#ece2cc]/80 w-full max-w-2xl p-8 font-serif text-[#6c5127] flex items-center justify-center text-lg">
                            Loading channel...
                        </div>
                    </div>
                ) : (
                    <MessagePanel channelId={activeChannel.id} />
                )}
            </div>
        </>
    );
}
