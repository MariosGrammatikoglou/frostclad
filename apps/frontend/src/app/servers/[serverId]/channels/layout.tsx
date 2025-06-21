'use client';

import Sidebar from '@/components/Sidebar';
import ChannelSidebar from '@/components/ChannelSidebar';

export default function ChannelsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', height: '70%', width: '70%' }}>
            {/* Server Sidebar */}
            <div style={{ width: 240, minWidth: 200, height: "100%" }}>
                <Sidebar />
            </div>
            {/* Main area: children */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, background: "#c0c0c0" }}>
                {children}
            </div>
            {/* Channel Sidebar */}
            <div style={{ width: 240, minWidth: 200, height: "100%" }}>
                <ChannelSidebar />
            </div>
        </div>
    );
}
