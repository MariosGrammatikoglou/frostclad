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

    if (isLoading) return <div className="w-64 bg-gray-800 p-4">Loading...</div>;

    return (
        <div className="w-64 bg-gray-800 p-4 flex flex-col h-full">
            <div>
                <button
                    onClick={() => router.push('/servers')}
                    className="block w-full mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-left"
                >
                    ← Back to Hub
                </button>

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

            {/* 🔻 Logout button pinned bottom */}
            <div className="mt-auto pt-6">
                <button
                    onClick={handleLogout}
                    className="w-full text-sm bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
