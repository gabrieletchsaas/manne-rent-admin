"use client";

import React, { useState, useEffect, useTransition } from "react";
import { fetchAdminUsers, suspendUser, reactivateUser, deleteUser } from "@/app/actions/admin";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";
import {
  UserCircleIcon,
  XMarkIcon,
  CheckCircleIcon,
  NoSymbolIcon,
  TrashIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

type User = {
  id: string;
  full_name: string | null;
  email: string | null;
  whatsapp_number: string | null;
  account_type: string | null;
  subscription_plan: string | null;
  avatar_url: string | null;
  status: string | null;
  created_at: string | null;
};

// ── Badges colorés ────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string | null }) {
  const map: Record<string, string> = {
    locataire: "bg-blue-100 text-blue-700 border-blue-200",
    proprietaire: "bg-emerald-100 text-emerald-700 border-emerald-200",
    agence: "bg-purple-100 text-purple-700 border-purple-200",
    diaspora: "bg-orange-100 text-orange-700 border-orange-200",
    admin: "bg-red-100 text-red-700 border-red-200",
  };
  const key = (role ?? "").toLowerCase();
  const cls = map[key] ?? "bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-white/40 dark:border-white/5";
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cls}`}>
      {role ?? "Standard"}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string | null }) {
  const map: Record<string, string> = {
    PRO: "bg-amber-100 text-amber-700 border-amber-200",
    AGENCY: "bg-purple-100 text-purple-700 border-purple-200",
    FREE: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-white/30 dark:border-white/5",
  };
  const key = (plan ?? "FREE").toUpperCase();
  const cls = map[key] ?? map["FREE"];
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cls}`}>
      {plan ?? "FREE"}
    </span>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const suspended = status === "suspended";
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${suspended ? "bg-red-400" : "bg-emerald-400"}`} />
      <span className={`text-[10px] font-black uppercase tracking-widest ${suspended ? "text-red-400" : "text-emerald-500"}`}>
        {suspended ? "Suspendu" : "Actif"}
      </span>
    </div>
  );
}

// ── Modale Profil Complet ─────────────────────────────────────────────────────
function UserModal({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#0B1C3D] rounded-[32px] border border-slate-100 dark:border-white/10 p-10 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-center gap-5 mb-8">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-[#F59E0B]/30" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#1E3A8A] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {user.full_name?.charAt(0) ?? "U"}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-[#1A1A2E] dark:text-white">
              {user.full_name ?? "Sans nom"}
            </h2>
            <RoleBadge role={user.account_type} />
          </div>
        </div>

        <div className="space-y-4">
          {user.email && (
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
              <EnvelopeIcon className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-white/60">{user.email}</span>
            </div>
          )}
          {user.whatsapp_number && (
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
              <PhoneIcon className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-slate-600 dark:text-white/60">{user.whatsapp_number}</span>
            </div>
          )}
          <div className="flex gap-3">
            <div className="flex-1 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Plan</p>
              <PlanBadge plan={user.subscription_plan} />
            </div>
            <div className="flex-1 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Statut</p>
              <StatusBadge status={user.status} />
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Inscription</p>
            <p className="text-sm font-medium text-slate-600 dark:text-white/60">
              {user.created_at
                ? format(new Date(user.created_at), "dd MMMM yyyy, HH:mm", { locale: fr })
                : "-"}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ID</p>
            <p className="text-[11px] font-mono text-slate-400">{user.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modale Confirmation Suppression ───────────────────────────────────────────
function ConfirmDeleteModal({
  user,
  onConfirm,
  onCancel,
}: {
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#0B1C3D] rounded-[24px] border border-red-100 dark:border-red-900/30 p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <TrashIcon className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1A1A2E] dark:text-white">Confirmer la suppression</h3>
            <p className="text-sm text-slate-400">Cette action est irréversible.</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-white/50 mb-8">
          Vous êtes sur le point de supprimer le profil de{" "}
          <strong className="text-[#1A1A2E] dark:text-white">{user.full_name ?? "cet utilisateur"}</strong>.
          Toutes ses données seront définitivement perdues.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
          >
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[60] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 ${
      type === "success"
        ? "bg-emerald-500 text-white"
        : "bg-red-500 text-white"
    }`}>
      {type === "success" ? <CheckCircleIcon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
      {message}
    </div>
  );
}

// ── Page Principale ───────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUsers = async () => {
    setIsLoading(true);
    const data = await fetchAdminUsers();
    setUsers(data as User[]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSuspend = (user: User) => {
    startTransition(async () => {
      const isSuspended = user.status === "suspended";
      const result = isSuspended
        ? await reactivateUser(user.id)
        : await suspendUser(user.id);

      if (result.ok) {
        showToast(
          isSuspended ? "Utilisateur réactivé ✅" : "Utilisateur suspendu 🔒",
          "success"
        );
        loadUsers();
      } else {
        showToast("Erreur lors de l'opération", "error");
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    startTransition(async () => {
      const result = await deleteUser(userToDelete.id);
      setUserToDelete(null);
      if (result.ok) {
        showToast("Utilisateur supprimé ✅", "success");
        loadUsers();
      } else {
        showToast("Erreur lors de la suppression", "error");
      }
    });
  };

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      {/* Modales */}
      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
      {userToDelete && (
        <ConfirmDeleteModal
          user={userToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setUserToDelete(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}

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
        <button
          onClick={loadUsers}
          disabled={isLoading || isPending}
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
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Chargement des utilisateurs...
              </p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <UserCircleIcon className="w-16 h-16 text-slate-200 dark:text-white/10 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Aucun utilisateur trouvé
              </p>
              <p className="text-slate-300 text-xs mt-2">
                Vérifiez que SUPABASE_SERVICE_ROLE_KEY est configurée dans Vercel.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Utilisateur</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rôle</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Plan</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inscription</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Utilisateur */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#F59E0B]/20"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#1E3A8A] flex items-center justify-center text-white font-bold text-sm shadow">
                            {user.full_name?.charAt(0) ?? "U"}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-sm text-[#1A1A2E] dark:text-white group-hover:text-[#F59E0B] transition-colors truncate max-w-[180px]">
                            {user.full_name ?? "Sans nom"}
                          </span>
                          {user.whatsapp_number && (
                            <span className="text-[11px] text-slate-400 dark:text-white/40 flex items-center gap-1">
                              <PhoneIcon className="w-3 h-3 text-emerald-400" />
                              {user.whatsapp_number}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Rôle */}
                    <td className="px-8 py-5">
                      <RoleBadge role={user.account_type} />
                    </td>
                    {/* Plan */}
                    <td className="px-8 py-5">
                      <PlanBadge plan={user.subscription_plan} />
                    </td>
                    {/* Date */}
                    <td className="px-8 py-5 text-xs font-medium text-slate-500 dark:text-white/40">
                      {user.created_at
                        ? format(new Date(user.created_at), "dd MMM yyyy", { locale: fr })
                        : "-"}
                    </td>
                    {/* Statut */}
                    <td className="px-8 py-5">
                      <StatusBadge status={user.status} />
                    </td>
                    {/* Actions */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {/* Voir */}
                        <button
                          onClick={() => setSelectedUser(user)}
                          title="Voir le profil"
                          className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {/* Suspendre / Réactiver */}
                        <button
                          onClick={() => handleSuspend(user)}
                          disabled={isPending}
                          title={user.status === "suspended" ? "Réactiver" : "Suspendre"}
                          className={`p-2 rounded-xl transition-colors ${
                            user.status === "suspended"
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 hover:bg-emerald-100"
                              : "bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100"
                          }`}
                        >
                          {user.status === "suspended" ? (
                            <CheckCircleIcon className="w-4 h-4" />
                          ) : (
                            <NoSymbolIcon className="w-4 h-4" />
                          )}
                        </button>
                        {/* Supprimer */}
                        <button
                          onClick={() => setUserToDelete(user)}
                          title="Supprimer"
                          className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
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
