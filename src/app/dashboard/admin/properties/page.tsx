import React from "react";
import { fetchAdminListings } from "@/app/actions/admin";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";
import PropertyRow from "@/components/dashboard/admin/PropertyRow";
import { BuildingOfficeIcon } from "@heroicons/react/24/solid";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const listings = await fetchAdminListings();

  return (
    <div className="p-4 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      {/* Header Mobile */}
      <DashboardMobileHeader firstName="Admin" accountType="admin" />

      {/* Header Desktop */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-[#1A1A2E] dark:text-white">
            Gestion des <span className="text-[#F97316]">Biens & Annonces</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Inventaire Global
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {listings.length} annonces enregistrées
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B1C3D]/50 backdrop-blur-xl rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Détails du Bien</th>
                <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Propriétaire</th>
                <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tarification</th>
                <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Catégorie</th>
                <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut & Visibilité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {listings.length > 0 ? (
                listings.map((prop: any) => (
                  <PropertyRow key={`${prop._table}-${prop.id}`} property={prop} />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center">
                        <BuildingOfficeIcon className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">Aucun bien trouvé dans la base de données.</p>
                      <p className="text-slate-400 text-xs font-medium opacity-60">Vérifiez que des biens sont bien enregistrés.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
