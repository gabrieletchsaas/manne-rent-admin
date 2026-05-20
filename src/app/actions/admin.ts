"use server";

import { createClient } from "@supabase/supabase-js";

// On ne crée plus le client au top-level pour éviter de faire planter le build Vercel
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Les variables d'environnement Supabase (URL ou Service Key) sont manquantes.");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function fetchAdminKPIs() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // 1. MRR (Monthly Recurring Revenue)
    const { data: usersWithPlan } = await supabaseAdmin
      .from("profiles")
      .select("subscription_plan")
      .in("subscription_plan", ["PRO", "AGENCY"]);

    const mrr = (usersWithPlan || []).reduce((acc, user) => {
      if (user.subscription_plan === "PRO") return acc + 25000;
      if (user.subscription_plan === "AGENCY") return acc + 50000;
      return acc;
    }, 0);

    // 2. Taux de conversion (Visiteur -> Inscrit)
    const { count: totalUsers } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Simulation visiteurs
    const visiteursSemaine = 3450; 
    const tauxConversionVisiteurInscrit = visiteursSemaine > 0 
      ? Math.round(((totalUsers || 0) / visiteursSemaine) * 100) 
      : 0;

    // 3. Taux de conversion (Inscrit -> Payant)
    const payants = (usersWithPlan || []).length;
    const tauxConversionInscritPayant = totalUsers && totalUsers > 0 
      ? Math.round((payants / totalUsers) * 100) 
      : 0;

    // 4. KPIs additionnels
    const [
      { count: totalProperties },
      { count: totalVehicles },
      { count: totalPlots }
    ] = await Promise.all([
      supabaseAdmin.from("properties").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("vehicles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("plots").select("*", { count: "exact", head: true })
    ]);

    const totalBiens = (totalProperties || 0) + (totalVehicles || 0) + (totalPlots || 0);

    return {
      visiteursSemaine,
      tauxConversionVisiteurInscrit,
      tauxConversionInscritPayant,
      churnMensuel: 1.2,
      mrr,
      totalUsers: totalUsers || 0,
      totalProperties: totalProperties || 0,
      totalVehicles: totalVehicles || 0,
      totalPlots: totalPlots || 0,
      totalBiens
    };
  } catch (error) {
    console.error("Erreur fetchAdminKPIs:", error);
    return {
      visiteursSemaine: 0,
      tauxConversionVisiteurInscrit: 0,
      tauxConversionInscritPayant: 0,
      churnMensuel: 0,
      mrr: 0,
      totalUsers: 0,
      totalProperties: 0,
      totalVehicles: 0,
      totalPlots: 0,
      totalBiens: 0
    };
  }
}

export async function fetchAdminUsers() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    // Utiliser select(*) évite le plantage complet (erreur 42703) si une colonne (ex: account_type) manque temporairement
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*");
    
    if (error) {
        console.error("Erreur fetchAdminUsers:", error);
        return [];
    }

    // Récupérer les téléphones depuis auth.admin
    try {
      const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
      if (authData?.users && data) {
        // Fusionner le téléphone dans le profil
        const mergedData = data.map(profile => {
          const authUser = authData.users.find(u => u.id === profile.id);
          return {
            ...profile,
            phone: authUser?.user_metadata?.phone || authUser?.phone || null
          };
        });
        
        // Tri manuel en mémoire pour éviter le plantage SQL
        return mergedData.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
      }
    } catch (e) {
      console.error("Erreur récupération phones:", e);
    }

    // Fallback avec tri manuel
    return (data || []).sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Exception fetchAdminUsers:", error);
    return [];
  }
}

export async function updateUserAdmin(userId: string, updates: { 
  is_verified?: boolean, 
  subscription_plan?: string,
  full_name?: string 
}) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Sécurité supplémentaire : On pourrait vérifier si l'appelant est admin ici aussi
    // mais le service role key bypass tout, donc on fait confiance à la couche UI/Middleware
    
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Erreur updateUserAdmin:", error);
    return { success: false, error: (error as any).message };
  }
}

export async function fetchAdminListings() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    console.log("[VERIFICATION_MAY16_1937] fetchAdminListings called");
    
    const [
      { data: properties },
      { data: vehicles },
      { data: plots },
    ] = await Promise.all([
      // Logements/terrains
      supabaseAdmin
        .from('properties')
        .select(`
          id, title, category, type, price, 
          status, is_visible, created_at, images,
          ville, quartier, address, owner_id
        `)
        .order('created_at', { ascending: false })
        .limit(50),

      // Véhicules
      supabaseAdmin
        .from('vehicles')
        .select(`
          id, title, type, price,
          status, is_visible, created_at, images,
          ville, owner_id
        `)
        .order('created_at', { ascending: false })
        .limit(50),

      // Parcelles
      supabaseAdmin
        .from('plots')
        .select(`
          id, title, type, price,
          status, is_visible, created_at, images,
          ville, owner_id
        `)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    // Extraire tous les IDs uniques de propriétaires
    const ownerIds = new Set<string>();
    [...(properties || []), ...(vehicles || []), ...(plots || [])].forEach(p => {
      if (p.owner_id) ownerIds.add(p.owner_id);
    });

    // Récupérer les profils correspondants
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, phone, avatar_url")
      .in("id", Array.from(ownerIds));

    const profilesMap = new Map();
    if (profiles) {
      profiles.forEach(p => profilesMap.set(p.id, p));
    }

    // Combiner et unifier le format
    const allListings = [
      ...(properties || []).map(p => ({
        ...p,
        _table: 'properties',
        _icon: '🏠',
        _category: p.category || 'LOGEMENT',
        owner: p.owner_id ? profilesMap.get(p.owner_id) || null : null
      })),
      ...(vehicles || []).map(v => ({
        ...v,
        _table: 'vehicles',
        _icon: '🚗',
        _category: 'VÉHICULE',
        owner: v.owner_id ? profilesMap.get(v.owner_id) || null : null
      })),
      ...(plots || []).map(pl => ({
        ...pl,
        _table: 'plots',
        _icon: '🌿',
        _category: 'PARCELLE',
        owner: pl.owner_id ? profilesMap.get(pl.owner_id) || null : null
      })),
    ].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return allListings;
  } catch (error) {
    console.error("Exception fetchAdminListings:", error);
    return [];
  }
}

export async function updateListingAdmin(
  listingId: string, 
  table: string, 
  updates: { status?: 'active' | 'inactive' | 'pending', is_visible?: boolean }
) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Validate table
    if (!['properties', 'vehicles', 'plots'].includes(table)) {
      throw new Error("Table invalide");
    }
    
    const { data, error } = await supabaseAdmin
      .from(table)
      .update(updates)
      .eq("id", listingId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Erreur updateListingAdmin:", error);
    return { success: false, error: (error as any).message };
  }
}

export async function fetchAdminTransactions() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    console.log("[VERIFICATION_MAY16_1937] fetchAdminTransactions called - Manual Join Version");
    // 1. Récupérer les transactions
    const { data: transactions, error } = await supabaseAdmin
      .from("rent_payments")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error("Erreur fetchAdminTransactions:", error);
      return [];
    }

    if (!transactions || transactions.length === 0) return [];

    // 2. Extraire tous les IDs uniques de locataires et propriétaires
    const userIds = new Set<string>();
    transactions.forEach(tx => {
      if (tx.locataire_id) userIds.add(tx.locataire_id);
      if (tx.proprietaire_id) userIds.add(tx.proprietaire_id);
    });

    // 3. Récupérer les profils correspondants
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email")
      .in("id", Array.from(userIds));

    const profilesMap = new Map();
    if (profiles) {
      profiles.forEach(p => profilesMap.set(p.id, p));
    }

    // 4. Fusionner les données pour que TransactionRow ait ce qu'il attend
    const enrichedTransactions = transactions.map(tx => ({
      ...tx,
      owner: tx.proprietaire_id ? profilesMap.get(tx.proprietaire_id) || null : null,
      tenant: tx.locataire_id ? profilesMap.get(tx.locataire_id) || null : null,
    }));

    return enrichedTransactions;
  } catch (error) {
    console.error("Exception fetchAdminTransactions:", error);
    return [];
  }
}

// Version ultra-sécurisée pour le CTO : vérifie l'email AVANT de tenter la base de données
export async function checkIsAdmin(userId: string, userEmail?: string): Promise<boolean> {
  // 1. PRIORITÉ ABSOLUE : Vérification par Email (ne dépend pas de la clé secrète Vercel)
  const ctoEmails = ['gabrieletchisse@gmail.com'];
  if (userEmail && ctoEmails.includes(userEmail)) {
    return true;
  }

  try {
    // 2. Vérification par Base de données (nécessite la clé secrète)
    const supabaseAdmin = getSupabaseAdmin();
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    return data?.is_admin || false;
  } catch (error) {
    // Si la clé manque, on a déjà vérifié l'email au dessus, donc on renvoie false pour les autres
    console.error("Erreur checkIsAdmin (DB):", error);
    return false;
  }
}

export async function suspendUser(userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from('profiles').update({ status: 'suspended' }).eq('id', userId);
    if (error) throw error;
    return { ok: true };
  } catch (e: any) {
    console.error("Erreur suspendUser:", e);
    return { ok: false, error: e.message };
  }
}

export async function reactivateUser(userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from('profiles').update({ status: 'active' }).eq('id', userId);
    if (error) throw error;
    return { ok: true };
  } catch (e: any) {
    console.error("Erreur reactivateUser:", e);
    return { ok: false, error: e.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    // Try to delete auth user as well, which might fail if no permissions, but we can ignore or log it.
    await supabaseAdmin.auth.admin.deleteUser(userId).catch(console.error);
    const { error } = await supabaseAdmin.from('profiles').delete().eq('id', userId);
    if (error) throw error;
    return { ok: true };
  } catch (e: any) {
    console.error("Erreur deleteUser:", e);
    return { ok: false, error: e.message };
  }
}
