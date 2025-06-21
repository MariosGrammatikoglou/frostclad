'use client';

import Sidebar from '@/components/Sidebar';
import ChannelSidebar from '@/components/ChannelSidebar';


// ChannelsLayout.tsx
export default function ChannelsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--background)', // your retro bg
            }}
        >
            <div style={{ display: 'flex', height: '70vh', width: '70vw' }}>
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
        </div>
    );
}




