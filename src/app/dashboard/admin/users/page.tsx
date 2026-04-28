// SERVER COMPONENT — pas de "use client"
// Fetch côté serveur → données fraîches à chaque requête

import React from "react";
import { fetchAdminUsers } from "@/app/actions/admin";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";
import { UsersTable, type UserRow } from "./UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const { users, count } = await fetchAdminUsers();

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

      {/* Table (Client Component pour interactivité) */}
      <UsersTable initialUsers={users as UserRow[]} />
    </div>
  );
}
