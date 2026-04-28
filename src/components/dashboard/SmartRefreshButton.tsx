'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function SmartRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [, setTick] = useState(0) // Force re-render for timer
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    
    try {
      // 1. Invalide le cache Next.js
      router.refresh()
      
      // 2. Force reload des données Supabase (Mock API for now)
      // await Promise.all([
      //   fetch('/api/dashboard/stats', { cache: 'no-store' }),
      //   fetch('/api/dashboard/recent', { cache: 'no-store' }),
      // ])
      
      setLastRefresh(new Date())
      
    } finally {
      setTimeout(() => setIsRefreshing(false), 800)
    }
  }, [isRefreshing, router])

  const timeAgo = () => {
    const diff = Math.floor((Date.now() - lastRefresh.getTime()) / 1000)
    if (diff < 60) return `${diff}s`
    if (diff < 3600) return `${Math.floor(diff/60)}min`
    return `${Math.floor(diff/3600)}h`
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="hidden lg:flex flex-col items-center justify-center gap-[2px]"
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '16px',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: isRefreshing 
          ? 'linear-gradient(135deg, var(--bg-secondary, #0d1f3c), var(--accent, #1a3a6b))'
          : 'linear-gradient(135deg, #c9a84c, #f0d080)',
        border: '2px solid rgba(201,168,76,0.5)',
        boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
        cursor: isRefreshing ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        zIndex: 1000,
      }}
      title={`Actualiser • Dernière mise à jour: il y a ${timeAgo()}`}
    >
      <span style={{
        fontSize: '20px',
        animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none',
        color: isRefreshing ? '#c9a84c' : '#0a1628',
      }}>
        ↻
      </span>
      <span style={{
        fontSize: '8px',
        color: isRefreshing ? 'var(--text-secondary, #94a3b8)' : '#0a1628',
        fontWeight: 'bold',
      }}>
        {timeAgo()}
      </span>
    </button>
  )
}
