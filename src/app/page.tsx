'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('https://manne-rent-app.vercel.app/dashboard/admin');
  }, [router]);

  return (
    <div style={{
      background: '#0B1C3D',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#F59E0B',
      fontFamily: 'Arial',
    }}>
      <div style={{ textAlign: 'center' }}>
        <img
          src="/icons/admin-icon-192.png"
          width="80"
          alt="Admin Manne Rent"
          style={{ marginBottom: 16 }}
        />
        <p style={{ fontSize: 14, opacity: 0.8 }}>Chargement du Dashboard Admin...</p>
      </div>
    </div>
  );
}