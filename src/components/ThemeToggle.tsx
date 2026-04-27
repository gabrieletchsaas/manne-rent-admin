'use client'

import { useTheme } from '@/context/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-2xl transition-all duration-300 shadow-sm border"
      style={{
        background: theme === 'dark' ? '#0d1f3c' : '#f0d080',
        borderColor: theme === 'dark' ? 'rgba(201,168,76,0.3)' : '#c9a84c',
      }}
      aria-label="Basculer le thème"
    >
      <div 
        className="transition-transform duration-500"
        style={{ transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(360deg)' }}
      >
        {theme === 'dark' ? (
          <MoonIcon className="w-5 h-5" style={{ color: '#c9a84c' }} />
        ) : (
          <SunIcon className="w-5 h-5" style={{ color: '#0a1628' }} />
        )}
      </div>
    </button>
  )
}
