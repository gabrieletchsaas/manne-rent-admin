import React from "react";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import AdminMobileBottomBar from "@/components/dashboard/admin/AdminMobileBottomBar";
import AdminInstallPrompt from "@/components/dashboard/admin/AdminInstallPrompt";
import { SmartRefreshButton } from "@/components/dashboard/SmartRefreshButton";

import { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: {
    title: "Admin Manne Rent",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  applicationName: "Admin Manne Rent",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = await checkIsAdmin(user.id, user.email);
  if (!isAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col lg:flex-row font-sans overflow-hidden transition-colors duration-300">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0 custom-scrollbar relative">
        {children}
        <SmartRefreshButton />
      </main>
      <AdminInstallPrompt />
      <AdminMobileBottomBar />
    </div>
  );
}
