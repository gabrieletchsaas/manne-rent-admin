"use client";

import React, { useState, useTransition } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { updateUserAdmin } from "@/app/actions/admin";
import { useToast } from "@/context/ToastContext";
import { 
  CheckBadgeIcon, 
  ShieldCheckIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PhoneIcon } from "@heroicons/react/24/solid";

interface UserRowProps {
  user: {
    id: string;
    full_name: string | null;
    email: string | null;
    account_type: string | null;
    subscription_plan: string | null;
    is_verified: boolean;
    created_at: string | null;
    avatar_url: string | null;
    phone?: string | null;
  };
}

export default function UserRow({ user: initialUser }: UserRowProps) {
  const [user, setUser] = useState(initialUser);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [showPlanMenu, setShowPlanMenu] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const toggleVerification = async () => {
    const newStatus = !user.is_verified;
    
    startTransition(async () => {
      const result = await updateUserAdmin(user.id, { is_verified: newStatus });
      if (result.success) {
        setUser({ ...user, is_verified: newStatus });
        toast(newStatus ? "✅ Utilisateur vérifié !" : "ℹ️ Vérification retirée");
      } else {
        toast("❌ Erreur lors de la mise à jour", "error");
      }
    });
  };

  const updatePlan = async (plan: string) => {
    setShowPlanMenu(false);
    if (user.subscription_plan === plan) return;

    startTransition(async () => {
      const result = await updateUserAdmin(user.id, { subscription_plan: plan });
      if (result.success) {
        setUser({ ...user, subscription_plan: plan });
        toast(`✅ Plan mis à jour vers ${plan}`);
      } else {
        toast("❌ Erreur lors du changement de plan", "error");
      }
    });
  };

  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group border-b border-slate-100 dark:border-white/5 last:border-0">
      {/* Utilisateur */}
      <td className="px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                    src={user.avatar_url} 
                    alt={user.full_name || ""} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-[#0B1C3D] shadow-md"
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0B1C3D] to-[#1E3A8A] flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white dark:border-[#0B1C3D]">
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
            )}
            {user.is_verified && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -bottom-1 bg-white dark:bg-[#0B1C3D] rounded-full p-0.5"
                >
                    <CheckBadgeIcon className="w-5 h-5 text-[#F97316]" />
                </motion.div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-[#1A1A2E] dark:text-white group-hover:text-[#F97316] transition-colors">
              {user.full_name || "Sans nom"}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-white/40">{user.email}</span>
          </div>
        </div>
      </td>

      {/* Téléphone / WhatsApp */}
      <td className="px-4 sm:px-8 py-4 sm:py-6">
        {user.phone ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 font-mono">
              {user.phone}
            </span>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(user.phone || '');
                setCopied(user.id);
                setTimeout(() => setCopied(null), 2000);
              }}
              title="Copier le numéro"
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-colors border",
                copied === user.id 
                  ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:border-green-500/20" 
                  : "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20 dark:hover:bg-orange-500/20"
              )}
            >
              {copied === user.id ? '✅ Copié' : '📋 Copier'}
            </button>

            <a 
              href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour, je suis l'équipe Manne Rent. Nous vous contactons concernant votre compte.`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              title="Contacter sur WhatsApp"
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors"
            >
              💬 WA
            </a>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 italic">Non renseigné</span>
        )}
      </td>

      {/* Rôle / Type */}
      <td className="px-4 sm:px-8 py-4 sm:py-6">
        <span className="px-4 py-1.5 bg-[#0B1C3D]/5 dark:bg-white/5 border border-[#0B1C3D]/5 dark:border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1C3D] dark:text-white/60">
          {user.account_type || "Standard"}
        </span>
      </td>

      {/* Plan Souscrit */}
      <td className="px-4 sm:px-8 py-4 sm:py-6">
        <div className="relative">
            <button 
                onClick={() => setShowPlanMenu(!showPlanMenu)}
                className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95",
                    user.subscription_plan === 'AGENCY' ? 'bg-purple-100 text-purple-600 border border-purple-200' :
                    user.subscription_plan === 'PRO' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-white/5 dark:text-white/30 dark:border-white/5'
                )}
            >
                {user.subscription_plan || "FREE"}
                <ChevronDownIcon className="w-3 h-3 opacity-50" />
            </button>

            <AnimatePresence>
                {showPlanMenu && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowPlanMenu(false)} />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-[#0B1C3D] border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden"
                        >
                            {['FREE', 'PRO', 'AGENCY'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => updatePlan(p)}
                                    className={cn(
                                        "w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors",
                                        user.subscription_plan === p ? "bg-[#F97316] text-white" : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-white/60"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
      </td>

      {/* Date Inscription */}
      <td className="px-4 sm:px-8 py-4 sm:py-6 text-xs font-medium text-slate-500 dark:text-white/40">
        {user.created_at ? format(new Date(user.created_at), "dd MMM yyyy", { locale: fr }) : "-"}
      </td>

      {/* Actions (Statut / Vérification) */}
      <td className="px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-4">
            <button
                onClick={toggleVerification}
                disabled={isPending}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    user.is_verified 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20" 
                        : "bg-slate-50 text-slate-400 border border-slate-100 dark:bg-white/5 dark:border-white/5 grayscale"
                )}
            >
                <ShieldCheckIcon className={cn("w-4 h-4", user.is_verified ? "text-emerald-500" : "text-slate-300")} />
                {user.is_verified ? "Vérifié" : "Non vérifié"}
            </button>

            {isPending && (
                <div className="w-4 h-4 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
            )}
        </div>
      </td>
    </tr>
  );
}
