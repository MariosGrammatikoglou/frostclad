'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

console.log('➡️ NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);


interface Channel {
    id: string;
    name: string;
    type: string;
}

export default function ChannelSidebar() {
    const { serverId, channelId } = useParams() as { serverId: string; channelId?: string };
    const router = useRouter();
    const [textChannels, setTextChannels] = useState<Channel[]>([]);

    useEffect(() => {
        api.get(`/channels/server/${serverId}`).then(res => {
            setTextChannels((res.data as Channel[]).filter(c => c.type === 'text'));
        });
    }, [serverId]);

    const handleTextClick = (id: string) => {
        if (id === channelId) return;
        router.push(`/servers/${serverId}/channels/${id}`);
    };

    return (
        <div className="window" style={{ margin: 8, height: 'calc(100% - 16px)', minWidth: 220 }}>
            <div className="title-bar">
                <div className="title-bar-text">Channels</div>
            </div>
            <div className="window-body">
                <b style={{ fontSize: 16, marginBottom: 12, display: "block" }}>📌 Text Channels</b>
                {textChannels.map(channel => (
                    <button
                        key={channel.id}
                        onClick={() => handleTextClick(channel.id)}
                        className="button"
                        style={{
                            width: "100%",
                            marginBottom: 8,
                            background: channel.id === channelId ? "#00808022" : undefined,
                            fontWeight: channel.id === channelId ? "bold" : undefined,
                        }}
                    >
                        # {channel.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
