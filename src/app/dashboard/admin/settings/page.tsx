"use client";

import React from "react";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";
import { 
  ShieldCheckIcon, 
  BellIcon, 
  PaintBrushIcon
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const settingsGroups = [
  {
    title: "Système & Sécurité",
    icon: <ShieldCheckIcon className="w-5 h-5" />,
    items: [
      { name: "Maintenance du site", description: "Activer/Désactiver le mode maintenance", status: "Désactivé" },
      { name: "Backups Automatiques", description: "Gestion des sauvegardes Supabase", status: "Quotidien" },
    ]
  },
  {
    title: "Notifications Admin",
    icon: <BellIcon className="w-5 h-5" />,
    items: [
      { name: "Alertes Revenus", description: "Recevoir un email pour chaque transaction", status: "Activé" },
      { name: "Nouveaux Utilisateurs", description: "Rapport quotidien des inscriptions", status: "Activé" },
    ]
  },
  {
    title: "Design & UX",
    icon: <PaintBrushIcon className="w-5 h-5" />,
    items: [
      { name: "Thème Premium", description: "Forcer le design luxury pour tous", status: "Par défaut" },
      { name: "Animations", description: "Transitions fluides et micro-interactions", status: "Optimisé" },
    ]
  }
];

export default function AdminSettingsPage() {
  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      <DashboardMobileHeader firstName="Admin" accountType="admin" />

      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-[#1A1A2E] dark:text-white">
            Paramètres <span className="text-[#F59E0B]">Système</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Configuration de la plateforme</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {settingsGroups.map((group, i) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-[#0B1C3D]/50 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-[32px] p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-xl">
                    {group.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] dark:text-white">{group.title}</h3>
            </div>

            <div className="space-y-4">
                {group.items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-[#F59E0B]/30 transition-all">
                        <div>
                            <p className="font-bold text-sm text-[#1A1A2E] dark:text-white">{item.name}</p>
                            <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.status}</span>
                            <div className="w-10 h-5 bg-[#0B1C3D]/10 dark:bg-white/10 rounded-full relative">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-[#F59E0B] rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
