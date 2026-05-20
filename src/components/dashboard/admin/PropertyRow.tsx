"use client";

import React, { useState, useTransition } from "react";
import { updateListingAdmin } from "@/app/actions/admin";
import { useToast } from "@/context/ToastContext";
import { 
  BuildingOfficeIcon, 
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  NoSymbolIcon
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PropertyRowProps {
  property: {
    id: string;
    title: string;
    category: string;
    price: number;
    status: 'active' | 'inactive' | 'pending';
    is_visible: boolean;
    owner_id: string;
    address?: string;
    city?: string;
    _table?: string;
    _icon?: string;
    _category?: string;
    owner?: {
      full_name: string | null;
      email: string | null;
      avatar_url: string | null;
    };
  };
}

export default function PropertyRow({ property: initialProperty }: PropertyRowProps) {
  const [property, setProperty] = useState(initialProperty);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const toggleVisibility = async () => {
    const newVisibility = !property.is_visible;
    
    startTransition(async () => {
      const result = await updateListingAdmin(property.id, property._table || 'properties', { is_visible: newVisibility });
      if (result.success) {
        setProperty({ ...property, is_visible: newVisibility });
        toast(newVisibility ? "✅ Bien visible sur la plateforme" : "ℹ️ Bien masqué");
      } else {
        toast("❌ Erreur de mise à jour", "error");
      }
    });
  };

  const updateStatus = async (status: 'active' | 'inactive' | 'pending') => {
    setShowStatusMenu(false);
    if (property.status === status) return;

    startTransition(async () => {
      const result = await updateListingAdmin(property.id, property._table || 'properties', { status });
      if (result.success) {
        setProperty({ ...property, status });
        toast(`✅ Statut mis à jour : ${status.toUpperCase()}`);
      } else {
        toast("❌ Erreur lors du changement de statut", "error");
      }
    });
  };

  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group border-b border-slate-100 dark:border-white/5 last:border-0">
      {/* Détails du Bien */}
      <td className="px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#F97316]/20 to-[#1E3A8A]/20 flex items-center justify-center border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden shrink-0 text-xl">
            {property._icon ? property._icon : <BuildingOfficeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E3A8A] dark:text-luxury-gold" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs sm:text-sm text-[#1A1A2E] dark:text-white group-hover:text-[#F97316] transition-colors truncate">
              {property.title}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-white/40 truncate max-w-[150px] sm:max-w-[200px]">
              {property.address || property.city || "Cotonou"}
            </span>
          </div>
        </div>
      </td>

      {/* Propriétaire */}
      <td className="px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-2 sm:gap-3">
            {property.owner?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={property.owner.avatar_url} alt="" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover" />
            ) : (
                <UserCircleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-300 dark:text-white/10" />
            )}
            <div className="flex flex-col min-w-0">
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-white/80 truncate max-w-[80px] sm:max-w-[120px]">{property.owner?.full_name || "Utilisateur"}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-white/30 truncate max-w-[80px] sm:max-w-[120px]">{property.owner?.email || property.owner_id.substring(0, 8)}</span>
            </div>
        </div>
      </td>

      {/* Tarification */}
      <td className="px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-col">
            <span className="font-black text-xs sm:text-sm text-[#1A1A2E] dark:text-white whitespace-nowrap">
                {property.price?.toLocaleString()} <span className="text-[9px] sm:text-[10px] font-black text-[#F97316]">FCFA</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Prix Global</span>
        </div>
      </td>

      {/* Catégorie */}
      <td className="px-4 sm:px-8 py-4 sm:py-6">
        <span className="px-2 sm:px-3 py-1 bg-[#F97316]/5 border border-[#F97316]/10 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#F97316]">
            {property._category || property.category || "Immobilier"}
        </span>
      </td>

      {/* Statut & Actions */}
      <td className="px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-4">
            {/* Status Menu */}
            <div className="relative">
                <button 
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95",
                        property.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                        property.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-orange-500/10 dark:border-orange-500/20' :
                        'bg-red-50 text-red-600 border border-red-100 dark:bg-red-500/10 dark:border-red-500/20'
                    )}
                >
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        property.status === 'active' ? 'bg-emerald-500' :
                        property.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                    )} />
                    {property.status === 'active' ? 'Actif' : property.status === 'pending' ? 'En attente' : 'Inactif'}
                    <ChevronDownIcon className="w-3 h-3 opacity-50" />
                </button>

                <AnimatePresence>
                    {showStatusMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#0B1C3D] border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden p-2"
                            >
                                {[
                                    { id: 'active', label: 'Activer', icon: CheckCircleIcon, color: 'text-emerald-500' },
                                    { id: 'pending', label: 'Mettre en attente', icon: ExclamationCircleIcon, color: 'text-orange-500' },
                                    { id: 'inactive', label: 'Désactiver', icon: NoSymbolIcon, color: 'text-red-500' }
                                ].map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => updateStatus(s.id as any)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors rounded-xl",
                                            property.status === s.id ? "bg-slate-50 dark:bg-white/5 text-[#F97316]" : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-white/60"
                                        )}
                                    >
                                        <s.icon className={cn("w-4 h-4", s.color)} />
                                        {s.label}
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Visibility Toggle */}
            <button
                onClick={toggleVisibility}
                disabled={isPending}
                className={cn(
                    "p-2.5 rounded-xl border transition-all",
                    property.is_visible 
                        ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20" 
                        : "bg-slate-50 text-slate-400 border-slate-100 dark:bg-white/5 dark:border-white/5"
                )}
                title={property.is_visible ? "Masquer du site" : "Afficher sur le site"}
            >
                {property.is_visible ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
            </button>

            {isPending && (
                <div className="w-4 h-4 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
            )}
        </div>
      </td>
    </tr>
  );
}
