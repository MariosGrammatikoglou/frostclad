'use client';

import Sidebar from '@/components/Sidebar';
import ChannelSidebar from '@/components/ChannelSidebar';

export default function ChannelsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            width: '100%',
            background: '#c0c0c0',
        }}>
            {/* Server Sidebar */}
            <div style={{
                minWidth: 160,
                background: '#d4d0c8',
                borderRight: '2px solid #fff',
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
            }}>
                <div className="window" style={{ height: '100%', minHeight: 0, margin: 0, borderRadius: 0 }}>
                    <div className="title-bar">
                        <div className="title-bar-text">Servers</div>
                    </div>
                    <div className="window-body" style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
                        <Sidebar />
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div style={{
                flex: 1,
                background: '#fff',
                minHeight: 0,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '2px solid #808080',
                borderRight: '2px solid #808080'
            }}>
                {children}
            </div>
            {/* Channel Sidebar */}
            <div style={{
                minWidth: 200,
                background: '#ece9d8',
                borderLeft: '2px solid #fff',
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
            }}>
                <div className="window" style={{ height: '100%', minHeight: 0, margin: 0, borderRadius: 0 }}>
                    <div className="title-bar">
                        <div className="title-bar-text">Channels</div>
                    </div>
                    <div className="window-body" style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
                        <ChannelSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
