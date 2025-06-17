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
        // Fetch channels and redirect to the first channel
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
        <div className="p-8 text-[#6c5127] font-serif">
            Loading channels...
        </div>
    );
}
