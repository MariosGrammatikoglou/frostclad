'use client';

import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import useAuth from '@/hooks/useAuth';
import MessagePanel from '@/components/MessagePanel';
import ServerHeader from '@/components/ServerHeader';

export default function ChannelPage() {
    const { user } = useAuth();
    const { channelId, serverId } = useParams() as { serverId: string; channelId: string };

    if (!channelId || !serverId) {
        return <div className="p-4 text-white">Invalid channel</div>;
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 p-6 flex flex-col">
                <ServerHeader />
                <MessagePanel channelId={channelId} />
            </main>
        </div>
    );
}
