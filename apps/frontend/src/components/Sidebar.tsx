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

    if (isLoading) return <div className="w-64 bg-[#2e2518] p-4">Loading...</div>;

    return (
        <div className="w-60 h-full p-4 flex flex-col bg-[#2e2518] border-r-4 border-[#bfa36f] shadow-lg font-serif">
            <div>
                <button
                    onClick={() => router.push('/servers')}
                    className="bg-[#ad8b46] hover:bg-[#bfa36f] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow mb-4"
                >
                    ← Back to Hub
                </button>

                <h2 className="text-xl font-bold mb-4 text-[#ecd8b2] font-serif">Servers</h2>

                <ul className="space-y-2">
                    {servers?.map((s: Server) => (
                        <li key={s.id}>
                            <Link
                                href={`/servers/${s.id}/channels`}
                                className="hover:underline text-[#ecd8b2]"
                            >
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
                    className="bg-[#ad8b46] hover:bg-[#bfa36f] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
