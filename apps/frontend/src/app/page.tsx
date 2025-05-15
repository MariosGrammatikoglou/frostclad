'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push(`/servers/test/channels`);
    }
  }, [user, loading]);

  return <div className="p-4">Redirecting to Frostclad app...</div>;
}
