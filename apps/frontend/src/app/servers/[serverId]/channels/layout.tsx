'use client';

import Sidebar from '@/components/Sidebar';
import ChannelSidebar from '@/components/ChannelSidebar';

export default function ChannelsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--background)',
            }}
        >
            <div style={{ display: 'flex', height: '70vh', width: '80vw' }}>
                {/* Server Sidebar */}
                <div style={{ width: 240, minWidth: 200, height: "100%" }}>
                    <Sidebar />
                </div>
                {/* Main area: children */}
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, background: "#c0c0c0", height: "100%" }}>
                    {children}
                </div>
                {/* Channel Sidebar */}
                <div style={{ width: 240, minWidth: 200, height: "100%" }}>
                    <ChannelSidebar />
                </div>
            </div>
        </div>
    );
}
