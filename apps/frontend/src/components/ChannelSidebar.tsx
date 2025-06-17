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
        <aside
            className="
        w-full h-full p-6
        bg-[#f6e8c7]
        font-serif
        flex flex-col
        relative
        overflow-y-auto
      "
            style={{
                fontFamily: "'IM Fell English SC', serif",
            }}
        >
            <div>
                <h2 className="text-2xl mb-8 font-bold text-[#7c5b27] tracking-wider flex items-center gap-2">
                    <span>🗡️</span> <span>Text Channels</span>
                </h2>
                {textChannels.map(channel => (
                    <button
                        key={channel.id}
                        onClick={() => handleTextClick(channel.id)}
                        className={`w-full text-left py-3 px-6 mb-3 rounded-lg border-2 border-[#bfa36f] shadow font-bold font-serif text-lg transition-all duration-150 
              ${channel.id === channelId
                                ? 'bg-[#ad8b46] text-[#2d1d09] ring-2 ring-[#d4bc8a] shadow-lg'
                                : 'bg-[#fcf4dd] text-[#855e2b] hover:bg-[#e0c48b] hover:scale-[1.03]'
                            }`}
                        style={{
                            letterSpacing: '0.04em'
                        }}
                    >
                        # {channel.name}
                    </button>
                ))}
            </div>
        </aside>
    );
}
