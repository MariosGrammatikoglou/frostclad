'use client';

import useSWR from 'swr';
import api from '@/lib/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Server {
    id: string;
    name: string;
}

export default function Sidebar() {
    const router = useRouter();

    const { data: servers, isLoading } = useSWR('servers', () =>
        api.get('/servers', { withCredentials: true }).then((res) => res.data)
    );

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/login');
    };

    if (isLoading) return <div className="window-body">Loading...</div>;

    return (
        <div style={{ width: 240, marginRight: 10, height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="window" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="title-bar">
                    <div className="title-bar-text">Servers</div>
                </div>
                <div className="window-body" style={{ flex: 1, overflowY: "auto" }}>
                    <button
                        className="button"
                        style={{ marginBottom: 10, width: "100%" }}
                        onClick={() => router.push('/servers')}
                    >
                        ← Back to Hub
                    </button>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {servers?.map((s: Server) => (
                            <li key={s.id} style={{ marginBottom: 8 }}>
                                <Link href={`/servers/${s.id}/channels`} className="button" style={{ width: "100%" }}>
                                    {s.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="window-body" style={{ borderTop: "1px solid #ccc" }}>
                    <button className="button" style={{ width: "100%" }} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
