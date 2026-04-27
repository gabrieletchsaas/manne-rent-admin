'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Redirige vers le dashboard admin du projet principal
    window.location.replace(
      'https://manne-rent-app.vercel.app/dashboard/admin'
    )
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#0a1628',
      color: '#c9a84c',
      fontFamily: 'sans-serif',
      fontSize: '18px'
    }}>
      <p>Chargement du Dashboard Admin...</p>
    </div>
  )
}