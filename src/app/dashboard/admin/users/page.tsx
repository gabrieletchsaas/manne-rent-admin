import React from "react";
import { fetchAdminUsers } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";

export default async function AdminUsersPage() {
  const users = await fetchAdminUsers();

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      {/* Header Mobile */}
      <DashboardMobileHeader firstName="Admin" accountType="admin" />

      {/* Header Desktop */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-[#1A1A2E] dark:text-white">
            Gestion des <span className="text-[#F59E0B]">Utilisateurs</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Base de données membres
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {users.length} membres inscrits
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B1C3D]/50 backdrop-blur-xl rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Utilisateur</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rôle / Type</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Plan Souscrit</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date Inscription</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#1E3A8A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {user.full_name?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#1A1A2E] dark:text-white group-hover:text-[#F59E0B] transition-colors">{user.full_name || "Sans nom"}</span>
                        <span className="text-[11px] text-slate-400 dark:text-white/40">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 bg-[#0B1C3D]/5 dark:bg-white/5 border border-[#0B1C3D]/5 dark:border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1C3D] dark:text-white/60">
                      {user.account_type || "Standard"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.subscription_plan === 'AGENCY' ? 'bg-purple-100 text-purple-600 border border-purple-200' :
                      user.subscription_plan === 'PRO' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-white/5 dark:text-white/30 dark:border-white/5'
                    }`}>
                      {user.subscription_plan || "FREE"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs font-medium text-slate-500 dark:text-white/40">
                    {user.created_at ? format(new Date(user.created_at), "dd MMMM yyyy", { locale: fr }) : "-"}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">Actif</span>
                    </div>
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
