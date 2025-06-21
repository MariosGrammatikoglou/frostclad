'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Channel {
    id: string;
    name: string;
    type: string;
}

export default function ChannelsRootPage() {
    const { serverId } = useParams() as { serverId: string };
    const router = useRouter();

    useEffect(() => {
        async function redirectToFirstChannel() {
            const res = await api.get(`/channels/server/${serverId}`);
            const channels: Channel[] = res.data;
            const first = channels[0];
            if (first) {
                router.replace(`/servers/${serverId}/channels/${first.id}`);
            }
        }
        if (serverId) redirectToFirstChannel();
    }, [serverId, router]);

    return (
        <div className="window" style={{ margin: 32, minWidth: 320 }}>
            <div className="title-bar">
                <div className="title-bar-text">Loading Channel</div>
            </div>
            <div className="window-body" style={{ color: '#222' }}>
                Please wait, loading channels...
            </div>
        </div>
    );
}
