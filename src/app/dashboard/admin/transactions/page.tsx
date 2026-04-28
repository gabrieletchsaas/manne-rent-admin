"use client";

import React, { useState, useEffect } from "react";
import { fetchAdminTransactions } from "@/app/actions/admin";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";
import {
  BanknotesIcon,
  ArrowPathIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

type Transaction = {
  id: string;
  type: string;
  amount: number | null;
  status: string | null;
  created_at: string | null;
  due_date: string | null;
  user_name: string;
  user_whatsapp: string;
  user_email: string;
};

function StatusBadge({ status }: { status: string | null }) {
  const s = (status ?? "").toLowerCase();
  if (s === "paid" || s === "completed" || s === "success") {
    return (
      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
        ✓ Confirmé
      </span>
    );
  }
  if (s === "en_retard" || s === "failed" || s === "error") {
    return (
      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-500 border border-red-100">
        ✗ Échoué / Retard
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
      ○ En attente
    </span>
  );
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTransactions = async () => {
    setIsLoading(true);
    const data = await fetchAdminTransactions();
    setTransactions(data as Transaction[]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Calcul montant total des paiements confirmés
  const totalConfirmed = transactions
    .filter((t) => ["paid", "completed", "success"].includes((t.status ?? "").toLowerCase()))
    .reduce((sum, t) => sum + (t.amount ?? 0), 0);

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
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
              {transactions.length} transactions · {totalConfirmed.toLocaleString()} FCFA encaissés
            </span>
          </div>
        </div>
        <button
          onClick={loadTransactions}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)] active:scale-95 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#0a1628" }}
        >
          <ArrowPathIcon className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white dark:bg-[#0B1C3D]/50 backdrop-blur-xl rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement...</p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <BanknotesIcon className="w-16 h-16 text-slate-200 dark:text-white/10 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Aucune transaction enregistrée
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Utilisateur</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Montant (FCFA)</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Utilisateur */}
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#1A1A2E] dark:text-white group-hover:text-[#F59E0B] transition-colors">
                          {tx.user_name}
                        </span>
                        {tx.user_whatsapp && tx.user_whatsapp !== "-" && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <PhoneIcon className="w-3 h-3 text-emerald-400" />
                            {tx.user_whatsapp}
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Type */}
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0B1C3D]/5 dark:bg-white/5 text-[#0B1C3D] dark:text-white/60 border border-[#0B1C3D]/5 dark:border-white/5">
                        {tx.type}
                      </span>
                    </td>
                    {/* Montant */}
                    <td className="px-8 py-5">
                      <span className="font-black text-sm text-[#1A1A2E] dark:text-white">
                        {tx.amount?.toLocaleString() ?? "-"}{" "}
                        <span className="text-[10px] text-[#F59E0B]">FCFA</span>
                      </span>
                    </td>
                    {/* Statut */}
                    <td className="px-8 py-5">
                      <StatusBadge status={tx.status} />
                    </td>
                    {/* Date */}
                    <td className="px-8 py-5 text-xs font-medium text-slate-500 dark:text-white/40">
                      {tx.created_at
                        ? format(new Date(tx.created_at), "dd MMM yyyy, HH:mm", { locale: fr })
                        : "-"}
                    </td>
                    {/* ID */}
                    <td className="px-8 py-5">
                      <span className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-white/20">
                        #{tx.id.substring(0, 12)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
