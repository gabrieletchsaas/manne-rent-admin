"use client";

import React, { useState, useEffect } from "react";
import { BellIcon, ArrowLeftIcon, Bars3Icon } from "@heroicons/react/24/solid";
import AvatarUpload from "@/components/dashboard/AvatarUpload";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [greeting, setGreeting] = useState(() => getGreeting(firstName));

  // Mise à jour de la salutation à chaque minute
  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting(firstName)), 60_000);
    return () => clearInterval(id);
  }, [firstName]);

  const subtitle = subtitleMap[accountType] ?? "Bienvenue sur Manne Rent";

  return (
    /* Visible uniquement sur mobile (lg:hidden) */
    <div className={cn(
      "lg:hidden mb-8 px-4 pt-safe bg-gradient-to-br from-[#0B1C3D] to-[#1E3A8A] rounded-b-[40px] shadow-2xl relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] before:opacity-10"
    )}>
      {/* Ligne 1 : Structure Premium */}
      <div className="flex items-center justify-between mb-8 mt-6 relative z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 bg-white/5 backdrop-blur-xl text-white rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all"
            aria-label="Retour Accueil"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event('openMobileMenu'))}
            className="w-10 h-10 bg-[#F59E0B] text-[#0B1C3D] rounded-full flex items-center justify-center shadow-lg border border-white/20 active:scale-90 transition-all"
            aria-label="Menu Mobile"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        </div>

        {/* Centered Profile for Admin Context or Default */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-[#F59E0B] p-0.5 bg-gradient-to-tr from-[#F59E0B] to-[#1E3A8A]">
                   <AvatarUpload />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#10B981] border-2 border-[#0B1C3D] rounded-full shadow-lg animate-pulse" />
            </div>
        </div>

        <div className="flex items-center gap-2">
          {extraActions}
          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl text-white border border-white/10 hover:bg-white/10 transition-all active:scale-90 shadow-xl group"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0B1C3D] shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-bounce" />
          </button>
        </div>
      </div>

      {/* Ligne 2 : Salutation Premium */}
      <div className="pb-8 text-center relative z-10">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight leading-tight">
          {greeting}
        </h1>
        <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mt-2">{subtitle}</p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
};

export default DashboardMobileHeader;

