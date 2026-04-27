"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Squares2X2Icon as LayoutDashboardIcon, 
    UsersIcon,
    HomeModernIcon as BuildingIcon,
    CreditCardIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon as LogOutIcon,
    XMarkIcon,
    Cog6ToothIcon
} from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SidebarLink {
    name: string;
    href: string;
    icon: React.ReactElement;
}

const AdminSidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const links: SidebarLink[] = [
        { name: "Vue d'ensemble", href: "/dashboard/admin", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
        { name: "Utilisateurs", href: "/dashboard/admin/users", icon: <UsersIcon className="w-5 h-5" /> },
        { name: "Biens", href: "/dashboard/admin/properties", icon: <BuildingIcon className="w-5 h-5" /> },
        { name: "Transactions", href: "/dashboard/admin/transactions", icon: <CreditCardIcon className="w-5 h-5" /> },
        { name: "Analytics Détaillé", href: "/dashboard/admin/analytics", icon: <ChartBarIcon className="w-5 h-5" /> },
        { name: "Paramètres", href: "/dashboard/admin/settings", icon: <Cog6ToothIcon className="w-5 h-5" /> },
    ];

    // Écouter l'événement custom pour ouvrir le menu mobile depuis le header
    useEffect(() => {
        const handleOpen = () => setIsMobileOpen(true);
        window.addEventListener("openMobileMenu", handleOpen);
        return () => window.removeEventListener("openMobileMenu", handleOpen);
    }, []);

    const isActive = (href: string) => pathname === href;

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-500",
                    isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar Drawer */}
            <aside className={cn(
                "w-[80vw] max-w-[310px] bg-[#0B1C3D] text-white flex flex-col h-[100dvh] fixed lg:sticky lg:w-[260px] top-0 z-[110]",
                "border-r border-white/5 shadow-[20px_0_60px_rgba(0,0,0,0.3)]",
                "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                "rounded-r-[40px] lg:rounded-none overflow-hidden"
            )}>
                {/* Bouton fermeture mobile */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden absolute top-6 right-6 w-12 h-12 bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 rounded-full text-white transition-all flex items-center justify-center z-10 active:scale-90"
                    aria-label="Fermer le menu"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="pt-16 px-8 flex-1 flex flex-col">
                    <Link href="/" className="flex flex-col gap-2 mb-12 group" onClick={() => setIsMobileOpen(false)}>
                        <div className="flex items-center gap-3">
                            <Image 
                                src="/manne-rent-logo.png" 
                                alt="Logo" 
                                width={48} 
                                height={48} 
                                className="h-12 w-auto rounded-full shadow-2xl transition-transform group-hover:scale-110 duration-500" 
                            />
                            <span className="font-display font-bold text-2xl tracking-tight">
                                MANNE <span className="text-[#F59E0B]">RENT</span>
                            </span>
                        </div>
                        <div className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full bg-[#F59E0B] text-[#0B1C3D] text-[10px] font-black tracking-widest uppercase ml-1">
                            ADMIN
                        </div>
                    </Link>

                    <div className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-6 px-1">Menu Principal</div>

                    <nav className="space-y-2">
                        {links.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 px-5 rounded-2xl transition-all font-bold text-xs tracking-wide min-h-[56px] group relative overflow-hidden",
                                        active
                                            ? "bg-[#F59E0B] text-[#0B1C3D] shadow-xl shadow-[#F59E0B]/20"
                                            : "text-white/50 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2 rounded-xl transition-colors",
                                        active ? "bg-[#0B1C3D]/10" : "bg-white/5 group-hover:bg-white/10"
                                    )}>
                                        {React.cloneElement(link.icon as React.ReactElement, { className: "w-5 h-5" })}
                                    </div>
                                    <span className="font-sans">{link.name}</span>
                                    
                                    {active && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#0B1C3D] rounded-l-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-12">
                        <div className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-6 px-1">Configuration</div>
                        <div className="flex items-center justify-between px-5 py-4 bg-white/5 rounded-2xl border border-white/5 mb-4">
                            <span className="text-xs font-bold text-white/60">Mode Sombre</span>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-white/5">
                    <button
                        onClick={async () => {
                            setIsMobileOpen(false);
                            await logout();
                        }}
                        className="w-full flex items-center gap-4 px-5 rounded-2xl transition-all font-bold text-xs tracking-wide text-red-400 hover:text-white hover:bg-red-500/10 min-h-[56px]"
                    >
                        <div className="p-2 bg-red-500/10 rounded-xl">
                            <LogOutIcon className="w-5 h-5" />
                        </div>
                        Quitter l'Admin
                    </button>
                    
                    <div className="mt-6 text-center">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Manne Rent v1.0.0</span>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
