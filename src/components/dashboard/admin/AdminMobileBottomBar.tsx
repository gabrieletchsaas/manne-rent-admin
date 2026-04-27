"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Squares2X2Icon,
  UsersIcon,
  HomeModernIcon,
  CreditCardIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/solid";

const adminTabs = [
  { key: "accueil", label: "Accueil", icon: <Squares2X2Icon className="w-5 h-5" />, href: "/dashboard/admin" },
  { key: "users", label: "Users", icon: <UsersIcon className="w-5 h-5" />, href: "/dashboard/admin/users" },
  { key: "biens", label: "Biens", icon: <HomeModernIcon className="w-5 h-5" />, href: "/dashboard/admin/properties" },
  { key: "revenus", label: "Revenus", icon: <CreditCardIcon className="w-5 h-5" />, href: "/dashboard/admin/transactions" },
  { key: "settings", label: "Paramètres", icon: <Cog6ToothIcon className="w-5 h-5" />, href: "/dashboard/admin/settings" },
];

const AdminMobileBottomBar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] h-[75px] bg-white border-t border-slate-100 flex items-center justify-around px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {adminTabs.map((tab) => {
        const active = isActive(tab.href);
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className="flex flex-col items-center justify-center flex-1 h-full relative transition-all active:scale-90"
          >
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300",
              active ? "bg-[#0B1C3D] text-white shadow-lg" : "text-slate-400"
            )}>
              {tab.icon}
            </div>
            
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-widest mt-1.5 transition-colors",
              active ? "text-[#0B1C3D]" : "text-slate-400"
            )}>
              {tab.label}
            </span>

            {active && (
              <div className="absolute bottom-1 w-1 h-1 bg-[#F59E0B] rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminMobileBottomBar;
