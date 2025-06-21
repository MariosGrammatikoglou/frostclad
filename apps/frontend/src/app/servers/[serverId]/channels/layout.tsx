'use client';

import Sidebar from '@/components/Sidebar';
import ChannelSidebar from '@/components/ChannelSidebar';

export default function ChannelsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="window"
            style={{
                width: '100vw',
                height: '100vh',
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                background: 'var(--background)',
            }}
        >
            {/* Server Sidebar */}
            <div style={{ width: 240, minWidth: 200, height: "100%" }}>
                <Sidebar />
            </div>
            {/* Main area: children */}
            <div style={{
                flex: 1,
                minHeight: 0,
                minWidth: 0,
                background: "#c0c0c0",
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}>
                {children}
            </div>
            {/* Channel Sidebar */}
            <div style={{ width: 240, minWidth: 200, height: "100%" }}>
                <ChannelSidebar />
            </div>
        </div>
    );
}
