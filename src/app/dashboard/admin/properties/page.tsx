import React from "react";
import { fetchAdminProperties } from "@/app/actions/admin";

export const dynamic = "force-dynamic";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";

export default async function AdminPropertiesPage() {
  const properties = await fetchAdminProperties();

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      {/* Header Mobile */}
      <DashboardMobileHeader firstName="Admin" accountType="admin" />

      {/* Header Desktop */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-[#1A1A2E] dark:text-white">
            Gestion des <span className="text-[#F59E0B]">Biens Immobiliers</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Inventaire Global
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {properties.length} annonces actives
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B1C3D]/50 backdrop-blur-xl rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Détails du Bien</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Propriétaire</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tarification</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type / Catégorie</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut Publication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {properties.map((prop: any) => (
                <tr key={prop.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[#1A1A2E] dark:text-white group-hover:text-[#F59E0B] transition-colors">{prop.title}</span>
                      <span className="text-[11px] text-slate-400 dark:text-white/40 truncate max-w-[250px]">{prop.address}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold">
                            {prop.owner_id?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-white/40">ID: {prop.owner_id?.substring(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-sm text-[#1A1A2E] dark:text-white">
                      {prop.price?.toLocaleString()} <span className="text-[10px] font-black text-[#F59E0B]">FCFA</span>
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
                        {prop.category || "Immobilier"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      prop.is_published ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {prop.is_published ? "● Publié" : "○ En attente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
