"use client";

import React, { useState, useEffect } from "react";
import { BellIcon, Bars3Icon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import AvatarUpload from "@/components/dashboard/AvatarUpload";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardMobileHeaderProps {
  firstName: string;
  accountType: "proprietaire" | "agence" | "locataire" | "diaspora" | string;

  /** Actions supplementaires à droite */
  extraActions?: React.ReactNode;
  children?: React.ReactNode;
  /** Afficher le bouton nouveau bien (optionnel) */
  showNewListing?: boolean;
}

function getGreeting(firstName: string): string {
  const hour = new Date().getHours();
  const name = firstName ? ` ${firstName}` : "";
  if (hour >= 6 && hour < 12) return `Bonjour${name} ! ☀️`;
  if (hour >= 12 && hour < 18) return `Bon après-midi${name} ! 🌤️`;
  if (hour >= 18) return `Bonsoir${name} ! 🌙`;
  return `Bonne nuit${name} ! 🌙`;
}

const subtitleMap: Record<string, string> = {
  proprietaire: "Pilotage de votre patrimoine immobilier",
  agence:       "Supervision de vos actifs immobiliers",
  locataire:    "Réservez votre prochaine expérience",
  diaspora:     "Gestion sécurisée de vos intérêts au Bénin",
};

const DashboardMobileHeader = ({
  firstName,
  accountType,
  extraActions,
  children,
}: DashboardMobileHeaderProps) => {
  const [greeting, setGreeting] = useState(() => getGreeting(firstName));
  const router = useRouter();
  const pathname = usePathname();

  // Mise à jour de la salutation à chaque minute
  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting(firstName)), 60_000);
    return () => clearInterval(id);
  }, [firstName]);

  const subtitle = subtitleMap[accountType] ?? "Bienvenue sur Manne Rent";
  const isMainPage = pathname === '/dashboard/admin';

  return (
    /* Visible uniquement sur mobile (lg:hidden) */
    <div className={cn(
      "lg:hidden mb-8 px-4 pt-safe rounded-b-[40px] relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] before:opacity-10"
    )}
    style={{
      background: 'linear-gradient(135deg, #0d1f3c 0%, #1a3a6b 50%, #0a1628 100%)',
      borderBottom: '1px solid rgba(201,168,76,0.3)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    }}
    >
      {/* Ligne 1 : Structure Premium */}
      <div className="flex items-center justify-between mb-8 mt-6 relative z-10">
        <div className="flex items-center gap-2">
          {!isMainPage && (
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-white/5 backdrop-blur-xl text-[#f0d080] rounded-full flex items-center justify-center border border-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.15)] active:scale-90 transition-all shadow-lg"
              aria-label="Retour"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => window.dispatchEvent(new Event('openMobileMenu'))}
            className="w-10 h-10 bg-[#c9a84c] text-[#0a1628] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(201,168,76,0.4)] border border-white/20 active:scale-90 transition-all"
            aria-label="Menu Mobile"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        </div>

        {/* Centered Profile for Admin Context or Default */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-[#c9a84c] p-0.5 bg-gradient-to-tr from-[#c9a84c] to-[#1a3a6b] shadow-[0_0_15px_rgba(201,168,76,0.3)]">
                   <AvatarUpload />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#10b981] border-2 border-[#0a1628] rounded-full shadow-lg animate-pulse" />
            </div>
        </div>

        <div className="flex items-center gap-2">
          {extraActions}
          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl text-[#f0d080] border border-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.15)] transition-all active:scale-90 shadow-xl group"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ef4444] rounded-full border-2 border-[#0a1628] shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-bounce" />
          </button>
        </div>
      </div>

      {/* Ligne 2 : Salutation Premium */}
      <div className="pb-8 text-center relative z-10">
        <h1 
          className="text-2xl font-display font-bold tracking-tight leading-tight"
          style={{ color: '#f0d080', textShadow: '0 2px 10px rgba(201,168,76,0.4)' }}
        >
          {greeting}
        </h1>
        <p 
          className="text-xs font-bold uppercase mt-2"
          style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '3px' }}
        >
          {subtitle}
        </p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
};

export default DashboardMobileHeader;

