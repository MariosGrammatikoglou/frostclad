'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

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
        <div
            className="window"
            style={{
                height: '100%',
                minWidth: 220,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div
                className="title-bar"
                style={{ paddingLeft: '8px', paddingTop: '4px', paddingBottom: '4px' }}
            >
                <div className="title-bar-text">Channels</div>
            </div>
            <div className="window-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <b style={{ fontSize: 16, marginBottom: 12, display: "block" }}>📌 Text Channels</b>
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        marginBottom: 8,
                    }}
                >
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
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            # {channel.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
