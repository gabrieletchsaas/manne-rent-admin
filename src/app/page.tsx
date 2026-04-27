'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Délai de 1.5s pour permettre au navigateur de proposer l'installation PWA
    const timer = setTimeout(() => setIsReady(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ 
      margin: 0, padding: 0, height: '100vh', width: '100vw', 
      overflow: 'hidden', background: '#0a1628', position: 'fixed',
      top: 0, left: 0
    }}>
      {!isReady ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100%', color: '#c9a84c', fontFamily: 'sans-serif'
        }}>
          <img src="/icons/admin-512.png" width="120" style={{ marginBottom: 24 }} alt="Logo" />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard Admin</h2>
          <p style={{ opacity: 0.8 }}>Chargement sécurisé...</p>
        </div>
      ) : (
        <iframe 
          src="https://manne-rent-app.vercel.app/dashboard/admin" 
          style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
          allow="fullscreen; clipboard-read; clipboard-write"
          title="Dashboard Admin"
        />
      )}
    </div>
  )
}