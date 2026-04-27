"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { MoonIcon, SunIcon, ComputerDesktopIcon } from "@heroicons/react/24/solid";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse"></div>;

  const renderIcon = () => {
    if (theme === 'system') return <ComputerDesktopIcon className="w-5 h-5 text-white" />;
    if (theme === 'dark' || theme === 'classic-dark') return <MoonIcon className="w-5 h-5 text-white" />;
    return <SunIcon className="w-5 h-5 text-white" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Sélectionner le thème"
      >
        {renderIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-brand-deep/80 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <button 
            onClick={() => { setTheme('light'); setIsOpen(false); }}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${theme === 'light' ? 'text-brand-orange font-bold bg-orange-50 dark:bg-orange-900/10' : 'text-slate-700 dark:text-slate-300'}`}
          >
            <SunIcon className="w-4 h-4" /> Lumière
          </button>
          <button 
            onClick={() => { setTheme('dark'); setIsOpen(false); }}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${theme === 'dark' ? 'text-brand-orange font-bold bg-orange-50 dark:bg-orange-900/10' : 'text-slate-700 dark:text-slate-300'}`}
          >
            <MoonIcon className="w-4 h-4" /> Sombre
          </button>
          <button 
            onClick={() => { setTheme('classic-dark'); setIsOpen(false); }}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${theme === 'classic-dark' ? 'text-brand-orange font-bold bg-orange-50 dark:bg-orange-900/10' : 'text-slate-700 dark:text-slate-300'}`}
          >
            <div className="w-4 h-4 rounded-full bg-[#1a1a2e] border border-white/20" /> Classique sombre
          </button>
          <button 
            onClick={() => { setTheme('system'); setIsOpen(false); }}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${theme === 'system' ? 'text-brand-orange font-bold bg-orange-50 dark:bg-orange-900/10' : 'text-slate-700 dark:text-slate-300'}`}
          >
            <ComputerDesktopIcon className="w-4 h-4" /> Système
          </button>
        </div>
      )}
    </div>
  );
}

