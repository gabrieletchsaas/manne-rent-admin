"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  HomeIcon,
  HomeModernIcon as Building2Icon,
  BanknotesIcon as DollarSignIcon,
  ChartBarIcon as BarChart3Icon,
  EllipsisHorizontalIcon as MoreHorizontalIcon,
  MagnifyingGlassIcon as SearchIcon,
  CalendarIcon,
  HeartIcon
} from "@heroicons/react/24/solid";

// We will generate ownerTabs dynamically inside the component to handle basePath

const tenantTabs = [
  { key: "accueil",      label: "Accueil",      icon: <HomeIcon className="w-5 h-5" />,           href: "/dashboard/tenant" },
  { key: "chercher",     label: "Chercher",     icon: <SearchIcon className="w-5 h-5" />,         href: "/#catalog" },
  { key: "reservations", label: "Réservations", icon: <CalendarIcon className="w-5 h-5" />,       href: "/dashboard/tenant?s=reservations" },
  { key: "favoris",      label: "Favoris",      icon: <HeartIcon className="w-5 h-5" />,          href: "/dashboard/tenant?s=favoris" },
  { key: "plus",         label: "Plus",         icon: <MoreHorizontalIcon className="w-5 h-5" />, href: "#" },
];

/* ─── Composant ───────────────────────────────────────────────────────────── */

const MobileBottomBarContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { accountType } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Fallback : si accountType n'est pas encore chargé, on détecte via l'URL
  const isAgency = accountType === "agence" || (accountType === null && pathname.startsWith("/dashboard/agency"));
  const isOwnerLike =
    accountType === "proprietaire" ||
    isAgency ||
    accountType === "diaspora" ||
    (accountType === null && pathname.startsWith("/dashboard/owner"));

  const basePath = isAgency ? "/dashboard/agency" : "/dashboard/owner";

  const ownerLikeTabs = [
    { key: "accueil",      label: "Accueil",    icon: <HomeIcon className="w-5 h-5" />,         href: basePath },
    { key: "biens",        label: "Mes Biens",  icon: <Building2Icon className="w-5 h-5" />,    href: `${basePath}?s=biens` },
    { key: "revenus",      label: "Revenus",    icon: <DollarSignIcon className="w-5 h-5" />,   href: `${basePath}?s=revenus` },
    { key: "stats",        label: "Stats",      icon: <BarChart3Icon className="w-5 h-5" />,    href: `${basePath}?s=statistiques` },
    { key: "plus",         label: "Plus",       icon: <MoreHorizontalIcon className="w-5 h-5" />, href: "#" },
  ];

  const tabs = isOwnerLike ? ownerLikeTabs : tenantTabs;
  const currentSection = searchParams.get("s");

  const isActive = (tab: (typeof tabs)[0]) => {
    if (tab.key === "plus") return false;
    
    // Pour les onglets hors dashboard comme "Chercher"
    if (!tab.href.startsWith("/dashboard")) return false;

    const [hrefPath, hrefQuery] = tab.href.split("?");
    const tabSection = hrefQuery ? new URLSearchParams(hrefQuery).get("s") : null;

    if (pathname !== hrefPath) return false;

    if (tab.key === "accueil") {
      // Accueil est actif si on est sur la route principale et aucune section n'est sélectionnée
      return !currentSection || currentSection === "accueil";
    }

    return currentSection === tabSection;
  };

  const handleTab = (tab: (typeof tabs)[0]) => {
    if (tab.key === "plus") {
      setShowMoreMenu((v) => !v);
      return;
    }
    setShowMoreMenu(false);
    router.push(tab.href);
  };

  return (
    <>
      {/* "Plus" overlay menu */}
      {showMoreMenu && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="fixed bottom-[100px] left-4 right-4 z-50 bg-[#0B1C3D]/95 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-6 lg:hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4 px-2">
              Plus d'options
            </p>
            <div className="grid grid-cols-2 gap-3">
              {isOwnerLike ? (
                <>
                    <Link
                      href="/dashboard/owner/new"
                      onClick={() => setShowMoreMenu(false)}
                      className="flex flex-col items-center gap-1.5 p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-colors"
                    >
                      <span className="text-2xl">➕</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B]">Nouveau bien</span>
                    </Link>
                  <Link
                    href={`${basePath}?s=loyers`}
                    onClick={() => setShowMoreMenu(false)}
                    className="flex flex-col items-center gap-1.5 p-4 bg-white/5 border border-white/5 rounded-2xl text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-2xl">🏠</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Loyers</span>
                  </Link>
                  <Link
                    href={`${basePath}?s=reservations`}
                    onClick={() => setShowMoreMenu(false)}
                    className="flex flex-col items-center gap-1.5 p-4 bg-white/5 border border-white/5 rounded-2xl text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-2xl">📅</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Réservations</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowMoreMenu(false)}
                    className="flex flex-col items-center gap-1.5 p-4 bg-white/5 border border-white/5 rounded-2xl text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-2xl">⚙️</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Paramètres</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard/tenant"
                    onClick={() => setShowMoreMenu(false)}
                    className="flex flex-col items-center gap-1.5 p-4 bg-white/5 border border-white/5 rounded-2xl text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-2xl">💳</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Paiements</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowMoreMenu(false)}
                    className="flex flex-col items-center gap-1.5 p-4 bg-white/5 border border-white/5 rounded-2xl text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-2xl">⚙️</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Paramètres</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Barre principale */}
      <nav
        className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 z-30",
          "min-h-[84px] bg-[#0B1C3D]/90 backdrop-blur-2xl border-t border-white/10",
          "flex items-start justify-around px-2 pt-3 pb-safe",
          "shadow-[0_-8px_30px_rgba(0,0,0,0.3)]"
        )}
      >
        {tabs.map((tab) => {
          const active = isActive(tab);
          const isMore = tab.key === "plus";
          const activeMore = isMore && showMoreMenu;
          const isSelected = active || activeMore;

          return (
            <button
              key={tab.key}
              onClick={() => handleTab(tab)}
              className="flex flex-col items-center justify-center flex-1 transition-all duration-300 active:scale-95"
            >
              <div
                className={cn(
                  "relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                  isSelected 
                    ? "bg-[#F59E0B] text-[#0B1C3D] shadow-[0_4px_12px_rgba(212,175,55,0.4)]" 
                    : "bg-transparent text-white/40"
                )}
              >
                <span className={cn(
                  "transition-all duration-300",
                  isSelected ? "scale-110" : "scale-100"
                )}>
                  {isSelected 
                    ? React.cloneElement(tab.icon as React.ReactElement, { className: "w-6 h-6" }) 
                    : tab.icon
                  }
                </span>
              </div>
              
              <span
                className={cn(
                  "text-[9px] font-black uppercase tracking-[0.15em] mt-1.5 transition-all duration-300",
                  isSelected ? "text-white opacity-100" : "text-white/30 opacity-70"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

const MobileBottomBar = () => {
  return (
    <Suspense fallback={<div className="h-[84px]" />}>
      <MobileBottomBarContent />
    </Suspense>
  );
};

export default MobileBottomBar;

