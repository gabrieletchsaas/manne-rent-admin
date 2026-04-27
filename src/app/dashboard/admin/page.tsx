"use client";

import React, { useEffect, useState } from "react";
import { fetchAdminKPIs } from "@/app/actions/admin";
import { 
  UsersIcon, 
  HomeModernIcon as BuildingIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UserPlusIcon,
  ArrowPathIcon,
  SunIcon,
  MoonIcon
} from "@heroicons/react/24/solid";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";
import KPICard from "@/components/dashboard/admin/KPICard";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/dashboard/NotificationBell";

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const loadKPIs = async () => {
    setIsLoading(true);
    const data = await fetchAdminKPIs();
    setKpis(data);
    setIsLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    loadKPIs();
    
    // Simulate a welcome toast or notification
    const timer = setTimeout(() => {
      // You could use a real toast here if a provider is available
      console.log("Bonjour Admin, voici votre tableau de bord");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!kpis) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement des données...</p>
      </div>
    </div>
  );

  const stats = [
    {
      name: "Utilisateurs Totaux",
      value: kpis.totalUsers.toLocaleString(),
      numericValue: kpis.totalUsers,
      icon: UsersIcon,
      change: "+12%",
      changeType: "increase" as const,
      color: "bg-blue-500",
      colorHex: "#3B82F6",
    },
    {
      name: "Biens Actifs",
      value: kpis.totalProperties.toLocaleString(),
      numericValue: kpis.totalProperties,
      icon: BuildingIcon,
      change: "+5%",
      changeType: "increase" as const,
      color: "bg-emerald-500",
      colorHex: "#10B981",
    },
    {
      name: "MRR (Revenus)",
      value: `${kpis.mrr.toLocaleString()} FCFA`,
      numericValue: kpis.mrr,
      icon: CurrencyDollarIcon,
      change: "+18%",
      changeType: "increase" as const,
      color: "bg-amber-500",
      colorHex: "#F59E0B",
    },
    {
      name: "Taux Conv. (Visiteurs)",
      value: `${kpis.tauxConversionVisiteurInscrit}%`,
      numericValue: kpis.tauxConversionVisiteurInscrit,
      icon: ChartBarIcon,
      change: "-2%",
      changeType: "decrease" as const,
      color: "bg-purple-500",
      colorHex: "#8B5CF6",
    },
  ];

  const currentHour = new Date().getHours();
  const greeting = currentHour >= 18 || currentHour < 6 ? "Bonsoir Admin ! 🌙" : "Bonjour Admin ! ☀️";

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      {/* Header Mobile */}
      <DashboardMobileHeader firstName="Admin" accountType="admin" />

      {/* Header Desktop Header */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-display font-bold text-[#1A1A2E] dark:text-white"
          >
            {greeting}
          </motion.h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                Données en temps réel
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bienvenue sur Manne Rent</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {mounted && (
            <div className="flex bg-white dark:bg-white/5 p-1 rounded-2xl border border-slate-100 dark:border-white/10">
              <button 
                onClick={() => setTheme("light")}
                className={cn("p-2 rounded-xl transition-all", theme === "light" ? "bg-slate-100 text-[#F59E0B] shadow-sm" : "text-slate-400 hover:text-slate-600")}
              >
                <SunIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setTheme("dark")}
                className={cn("p-2 rounded-xl transition-all", theme === "dark" ? "bg-slate-800 text-[#F59E0B] shadow-sm" : "text-slate-400 hover:text-slate-300")}
              >
                <MoonIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          <NotificationBell className="relative p-2.5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm" />

          <button 
            onClick={loadKPIs}
            className="flex items-center gap-2 px-6 py-3 bg-[#0B1C3D] text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#1E3A8A] transition-all shadow-xl shadow-blue-900/10 active:scale-95"
          >
            <ArrowPathIcon className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <KPICard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversion Funnel */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0B1C3D]/50 backdrop-blur-xl border border-slate-100 dark:border-white/5 p-10 rounded-[32px] shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
                <h3 className="text-2xl font-display font-bold text-[#1A1A2E] dark:text-white flex items-center gap-3">
                <ArrowTrendingUpIcon className="w-6 h-6 text-[#F59E0B]" />
                Tunnel de Conversion
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Analyse des flux utilisateurs</p>
            </div>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visiteurs → Inscrits</span>
                    <p className="text-lg font-bold text-[#1A1A2E] dark:text-white">Acquisition Mobile</p>
                </div>
                <span className="text-2xl font-display font-bold text-[#F59E0B]">{kpis.tauxConversionVisiteurInscrit}%</span>
              </div>
              <div className="h-4 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden p-1 border border-slate-100 dark:border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${kpis.tauxConversionVisiteurInscrit}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-[#F59E0B] to-amber-400 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inscrits → Payants</span>
                    <p className="text-lg font-bold text-[#1A1A2E] dark:text-white">Conversion Finale</p>
                </div>
                <span className="text-2xl font-display font-bold text-[#10B981]">{kpis.tauxConversionInscritPayant}%</span>
              </div>
              <div className="h-4 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden p-1 border border-slate-100 dark:border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${kpis.tauxConversionInscritPayant}%` }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-[#10B981] to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-slate-50 dark:bg-white/5 rounded-[24px] border border-slate-100 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <ChartBarIcon className="w-24 h-24" />
            </div>
            <p className="text-sm text-slate-500 dark:text-white/70 italic leading-relaxed relative z-10">
              "Note Stratégique : Le taux de conversion final est en progression de 2.4% par rapport au mois dernier. Focus sur l'optimisation de l'onboarding pour réduire le churn."
            </p>
          </div>
        </div>

        {/* Churn & Retention */}
        <div className="bg-[#0B1C3D] border border-white/5 p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F59E0B] opacity-[0.03] rounded-full blur-3xl" />
          
          <h3 className="text-2xl font-display font-bold mb-10 flex items-center gap-3">
            <UserPlusIcon className="w-6 h-6 text-[#F59E0B]" />
            Rétention
          </h3>
          
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-white/5"
                />
                <motion.circle
                  cx="88"
                  cy="88"
                  r="80"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="502.4"
                  initial={{ strokeDashoffset: 502.4 }}
                  animate={{ strokeDashoffset: 502.4 * (1 - 0.988) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold tracking-tighter">98.8%</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">Loyauté</span>
              </div>
            </div>
            
            <div className="mt-12 w-full space-y-4">
              <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Churn Mensuel</span>
                <span className="text-lg font-bold text-red-400">{kpis.churnMensuel}%</span>
              </div>
              <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Croissance User</span>
                <span className="text-lg font-bold text-[#10B981]">+5.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
