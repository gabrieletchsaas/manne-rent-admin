import React from "react";
import { fetchAdminTransactions } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";

export default async function AdminTransactionsPage() {
  const transactions = await fetchAdminTransactions();

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      {/* Header Mobile */}
      <DashboardMobileHeader firstName="Admin" accountType="admin" />

      {/* Header Desktop */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-[#1A1A2E] dark:text-white">
            Suivi des <span className="text-[#F59E0B]">Transactions</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Flux Financiers
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {transactions.length} transactions récentes
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B1C3D]/50 backdrop-blur-xl rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Référence</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Montant (FCFA)</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut Transaction</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Méthode</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Horodatage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucune transaction enregistrée</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#F59E0B] transition-colors">#{tx.id.substring(0, 12)}</span>
                        <span className="text-[10px] font-bold text-slate-300">Transaction ID Unique</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-sm text-[#1A1A2E] dark:text-white">
                        {tx.amount?.toLocaleString()} <span className="text-[10px] text-[#F59E0B]">FCFA</span>
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        tx.status === 'completed' || tx.status === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {tx.status === 'completed' || tx.status === 'success' ? "Succès" : tx.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-[#0B1C3D] dark:text-white/60">
                                PD
                            </div>
                            <span className="text-xs font-medium text-slate-500 dark:text-white/40">PayDunya</span>
                        </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-medium text-slate-500 dark:text-white/40">
                      {tx.created_at ? format(new Date(tx.created_at), "dd MMMM yyyy, HH:mm", { locale: fr }) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
