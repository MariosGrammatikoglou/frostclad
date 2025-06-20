'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/servers');
    } else if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  return (
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <div className="status-bar">
        <p>Redirecting to Frostclad app...</p>
      </div>
    </div>
  );
}
