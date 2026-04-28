"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  fetchAdminProperties,
  approveProperty,
  suspendProperty,
  deleteProperty,
} from "@/app/actions/admin";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";
import {
  HomeModernIcon,
  CheckCircleIcon,
  NoSymbolIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  ArrowPathIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

type Property = {
  id: string;
  title: string | null;
  address: string | null;
  price: number | null;
  category: string | null;
  status: string | null;
  is_published: boolean | null;
  images: string[] | null;
  owner_id: string | null;
  created_at: string | null;
  profiles?: {
    full_name: string | null;
    whatsapp_number: string | null;
    email: string | null;
  } | null;
};

function StatusBadge({ status, published }: { status: string | null; published: boolean | null }) {
  if (status === "active" || published) {
    return (
      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
        ● Actif
      </span>
    );
  }
  if (status === "suspended") {
    return (
      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-500 border border-red-100">
        ● Suspendu
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
      ○ En attente
    </span>
  );
}

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 ${
        type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? <CheckCircleIcon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
      {message}
    </div>
  );
}

function ConfirmDeleteModal({
  property,
  onConfirm,
  onCancel,
}: {
  property: Property;
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
          Vous êtes sur le point de supprimer le bien{" "}
          <strong className="text-[#1A1A2E] dark:text-white">"{property.title}"</strong>.
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
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [propToDelete, setPropToDelete] = useState<Property | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadProperties = async () => {
    setIsLoading(true);
    const data = await fetchAdminProperties();
    setProperties(data as Property[]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleApprove = (prop: Property) => {
    startTransition(async () => {
      const result = await approveProperty(prop.id);
      if (result.ok) {
        showToast("Bien approuvé et publié ✅", "success");
        loadProperties();
      } else {
        showToast("Erreur lors de l'approbation", "error");
      }
    });
  };

  const handleSuspend = (prop: Property) => {
    startTransition(async () => {
      const result = await suspendProperty(prop.id);
      if (result.ok) {
        showToast("Bien suspendu 🔒", "success");
        loadProperties();
      } else {
        showToast("Erreur lors de la suspension", "error");
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!propToDelete) return;
    startTransition(async () => {
      const result = await deleteProperty(propToDelete.id);
      setPropToDelete(null);
      if (result.ok) {
        showToast("Bien supprimé ✅", "success");
        loadProperties();
      } else {
        showToast("Erreur lors de la suppression", "error");
      }
    });
  };

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      {propToDelete && (
        <ConfirmDeleteModal
          property={propToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPropToDelete(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <DashboardMobileHeader firstName="Admin" accountType="admin" />

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
              {properties.length} annonces
            </span>
          </div>
        </div>
        <button
          onClick={loadProperties}
          disabled={isLoading || isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)] active:scale-95 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#0a1628" }}
        >
          <ArrowPathIcon className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      <div className="bg-white dark:bg-[#0B1C3D]/50 backdrop-blur-xl rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement...</p>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <HomeModernIcon className="w-16 h-16 text-slate-200 dark:text-white/10 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun bien trouvé</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Bien</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Propriétaire</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Prix (FCFA)</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Catégorie</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    {/* Bien */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {prop.images && prop.images.length > 0 ? (
                          <img
                            src={prop.images[0]}
                            alt=""
                            className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-100 dark:ring-white/5"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                            <HomeModernIcon className="w-6 h-6 text-slate-300 dark:text-white/20" />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-sm text-[#1A1A2E] dark:text-white group-hover:text-[#F59E0B] transition-colors truncate max-w-[200px]">
                            {prop.title ?? "Sans titre"}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-white/40 truncate max-w-[200px]">
                            {prop.address ?? "-"}
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* Propriétaire */}
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1A1A2E] dark:text-white">
                          {prop.profiles?.full_name ?? "Inconnu"}
                        </span>
                        {prop.profiles?.whatsapp_number && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <PhoneIcon className="w-3 h-3 text-emerald-400" />
                            {prop.profiles.whatsapp_number}
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Prix */}
                    <td className="px-8 py-5">
                      <span className="font-black text-sm text-[#1A1A2E] dark:text-white">
                        {prop.price?.toLocaleString() ?? "-"}{" "}
                        <span className="text-[10px] font-black text-[#F59E0B]">FCFA</span>
                      </span>
                    </td>
                    {/* Catégorie */}
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
                        {prop.category ?? "Immobilier"}
                      </span>
                    </td>
                    {/* Statut */}
                    <td className="px-8 py-5">
                      <StatusBadge status={prop.status} published={prop.is_published} />
                    </td>
                    {/* Actions */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {/* Approuver */}
                        <button
                          onClick={() => handleApprove(prop)}
                          disabled={isPending || prop.status === "active"}
                          title="Approuver"
                          className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 hover:bg-emerald-100 transition-colors disabled:opacity-30"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                        {/* Suspendre */}
                        <button
                          onClick={() => handleSuspend(prop)}
                          disabled={isPending || prop.status === "suspended"}
                          title="Suspendre"
                          className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 transition-colors disabled:opacity-30"
                        >
                          <NoSymbolIcon className="w-4 h-4" />
                        </button>
                        {/* Supprimer */}
                        <button
                          onClick={() => setPropToDelete(prop)}
                          title="Supprimer"
                          className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 transition-colors"
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
