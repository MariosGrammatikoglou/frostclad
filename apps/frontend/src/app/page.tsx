'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/servers'); // ✅ Redirect to Server Hub, not /test
    } else if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  return <div className="p-4">Redirecting to Frostclad app...</div>;
}
