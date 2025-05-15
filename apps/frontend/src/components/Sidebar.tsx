'use client';

import useSWR from 'swr';
import api from '@/lib/axios';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface Server {
    id: string;
    name: string;
}

export default function Sidebar() {
    const token = Cookies.get('token');

    const { data: servers, isLoading } = useSWR('servers', () =>
        api
            .get('/servers', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => res.data)
    );

    if (isLoading) return <div className="w-64 bg-gray-800 p-4">Loading...</div>;

    return (
        <div className="w-64 bg-gray-800 p-4">
            <h2 className="text-xl font-bold mb-4">Servers</h2>
            <ul className="space-y-2">
                {servers?.map((s: Server) => (
                    <li key={s.id}>
                        <Link href={`/servers/${s.id}/channels`} className="hover:underline">
                            {s.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
