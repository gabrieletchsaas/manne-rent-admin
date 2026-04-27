import React from "react";
import { fetchAdminKPIs } from "@/app/actions/admin";

export const dynamic = "force-dynamic";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";

export default async function AdminAnalyticsPage() {
  const kpis = await fetchAdminKPIs();

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      {/* Header Mobile */}
      <DashboardMobileHeader firstName="Admin" accountType="admin" />

      {/* Header Desktop */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-[#1A1A2E] dark:text-white">
            Analytics <span className="text-[#F59E0B]">Détaillés</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Intelligence d'Affaires
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Analyse de croissance {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Performance de Conversion */}
        <div className="bg-white dark:bg-[#0B1C3D]/50 backdrop-blur-xl p-10 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-sm">
          <h3 className="text-xl font-bold mb-8 text-[#1A1A2E] dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#F59E0B] rounded-full inline-block"></span>
            Performance de Conversion
          </h3>
          <div className="space-y-10">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visiteurs → Inscrits</span>
                <span className="text-2xl font-display font-bold text-[#F59E0B]">{kpis.tauxConversionVisiteurInscrit}%</span>
              </div>
              <div className="h-4 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden p-1">
                <div className="h-full bg-[#F59E0B] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.2)]" style={{ width: `${kpis.tauxConversionVisiteurInscrit}%` }}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inscrits → Payants</span>
                <span className="text-2xl font-display font-bold text-[#10B981]">{kpis.tauxConversionInscritPayant}%</span>
              </div>
              <div className="h-4 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden p-1">
                <div className="h-full bg-[#10B981] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]" style={{ width: `${kpis.tauxConversionInscritPayant}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Santé du Business */}
        <div className="bg-[#0B1C3D] p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B] opacity-[0.05] rounded-bl-full" />
          
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#10B981] rounded-full inline-block"></span>
            Santé du Business
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Churn Rate Mensuel</span>
              <div className="text-4xl font-bold text-red-400 tracking-tighter">{kpis.churnMensuel}%</div>
              <p className="text-[10px] font-bold text-white/20 mt-2">Désabonnements actifs</p>
            </div>
            <div className="p-8 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Indice Rétention</span>
              <div className="text-4xl font-bold text-[#10B981] tracking-tighter">{100 - kpis.churnMensuel}%</div>
              <p className="text-[10px] font-bold text-white/20 mt-2">Loyauté utilisateur</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[11px] text-white/40 leading-relaxed italic">
                * Les données sont actualisées chaque heure. La rétention est calculée sur une base mobile de 30 jours glissants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
