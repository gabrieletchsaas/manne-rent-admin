// SERVER COMPONENT — pas de "use client"
// Fetch côté serveur → données fraîches à chaque requête

import React from "react";
import { fetchAdminUsers } from "@/app/actions/admin";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";
import { UsersTable, type UserRow } from "./UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await fetchAdminUsers();
  const count = users.length;
  const error = null;

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
              {count} membres inscrits
            </span>
          </div>
        </div>
      </div>

      {/* Bandeau d'erreur visible sur la page (debug) */}
      {error && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-2">
            ⚠️ Erreur Supabase détectée
          </p>
          <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
            {error}
          </p>
          <p className="text-xs text-red-400 mt-3">
            Vérifier dans Vercel → Settings → Environment Variables :<br />
            <strong>SUPABASE_SERVICE_ROLE_KEY</strong> doit être présente et valide.
          </p>
        </div>
      )}

      {/* Table (Client Component pour interactivité) */}
      <UsersTable initialUsers={users as UserRow[]} />
    </div>
  );
}
