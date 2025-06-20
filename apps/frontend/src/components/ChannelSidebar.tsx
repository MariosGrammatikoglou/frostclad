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
            const all = res.data as Channel[];
            setTextChannels(all.filter(c => c.type === 'text'));
        });
    }, [serverId]);

    const handleTextClick = (id: string) => {
        if (id === channelId) return;
        router.push(`/servers/${serverId}/channels/${id}`);
    };

    return (
        <aside style={{ height: '100%', width: '100%', padding: 0, background: '#ece9d8' }}>
            <div className="window" style={{ height: '100%', minHeight: 0, margin: 0, borderRadius: 0 }}>
                <div className="title-bar">
                    <div className="title-bar-text">Channels</div>
                </div>
                <div className="window-body" style={{ overflowY: 'auto', height: 'calc(100% - 28px)', padding: 8 }}>
                    <div>
                        <div style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            marginBottom: 16,
                            color: '#222',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}>
                            <span role="img" aria-label="sword">🗡️</span>
                            <span>Text Channels</span>
                        </div>
                        {textChannels.map(channel => (
                            <button
                                key={channel.id}
                                onClick={() => handleTextClick(channel.id)}
                                className={`button ${channel.id === channelId ? 'active' : ''}`}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    marginBottom: 10,
                                    background: channel.id === channelId ? '#c0c0c0' : '#fff',
                                    border: channel.id === channelId ? '2px inset #000' : '2px outset #fff',
                                    fontWeight: channel.id === channelId ? 'bold' : 'normal',
                                    color: '#222',
                                    padding: '6px 10px',
                                    fontFamily: 'inherit',
                                    fontSize: 15,
                                    cursor: 'pointer',
                                }}
                            >
                                # {channel.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
