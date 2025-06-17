'use client';

import Sidebar from '@/components/Sidebar';
import ChannelSidebar from '@/components/ChannelSidebar';

export default function ChannelsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row h-full w-full">
            {/* Server Sidebar */}
            <div className="h-full w-56 bg-[#2e2518] border-r-4 border-[#bfa36f] shadow-inner flex flex-col">
                <Sidebar />
            </div>
            {/* Main area: children */}
            <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 bg-[#ede1bb] border-l-2 border-r-2 border-[#bfa36f]">
                {children}
            </div>
            {/* Channel Sidebar */}
            <div className="h-full w-64 bg-[#f6e8c7] border-l-8 border-[#bfa36f] shadow-inner flex flex-col">
                <ChannelSidebar />
            </div>
        </div>
    );
}
