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

    return (
        <div className="window" style={{ margin: 8, height: 'calc(100% - 16px)', minWidth: 220, display: 'flex', flexDirection: 'column' }}>
            <div className="title-bar">
                <div className="title-bar-text">Servers</div>
            </div>
            <div className="window-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div>
                    <button className="button" style={{ width: "100%", marginBottom: 10 }} onClick={() => router.push('/servers')}>← Back to Hub</button>
                </div>
                <b style={{ marginBottom: 10, display: "block" }}>Servers</b>
                <ul style={{ paddingLeft: 0, margin: 0, marginBottom: 10 }}>
                    {servers?.map((s: Server) => (
                        <li key={s.id} style={{ listStyle: 'none', marginBottom: 6 }}>
                            <Link href={`/servers/${s.id}/channels`} className="link">{s.name}</Link>
                        </li>
                    ))}
                </ul>
                <div style={{ flex: 1 }} />
                <button className="button" style={{ width: "100%" }} onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}
