"use server";

import { createClient } from "@supabase/supabase-js";

// ─── Client Supabase Admin (Service Role Key — bypasse le RLS) ────────────────
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('[Admin] URL:', url?.substring(0, 30));
  console.log('[Admin] KEY exists:', !!key);
  console.log('[Admin] KEY length:', key?.length);

  if (!url || !key) {
    throw new Error(
      'Variables Supabase manquantes: ' +
        JSON.stringify({ hasUrl: !!url, hasKey: !!key })
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ─── KPIs Admin ───────────────────────────────────────────────────────────────
export async function fetchAdminKPIs() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Lancer toutes les requêtes en parallèle
    const [
      usersRes,
      payingUsersRes,
      propertiesRes,
      reservationsRes,
      rentPaymentsRes,
    ] = await Promise.all([
      // 1. Nombre total utilisateurs
      supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact", head: true }),

      // 2. Utilisateurs payants (PRO ou AGENCY)
      supabaseAdmin
        .from("profiles")
        .select("subscription_plan")
        .in("subscription_plan", ["PRO", "AGENCY"]),

      // 3. Biens actifs
      supabaseAdmin
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),

      // 4. Réservations totales
      supabaseAdmin
        .from("reservations")
        .select("*", { count: "exact", head: true }),

      // 5. Revenus loyers confirmés
      supabaseAdmin
        .from("rent_payments")
        .select("amount")
        .eq("status", "paid"),
    ]);

    const totalUsers = usersRes.count ?? 0;
    const payingUsers = payingUsersRes.data ?? [];

    // MRR calculé via les plans actifs
    const mrr = payingUsers.reduce((acc, user) => {
      if (user.subscription_plan === "PRO") return acc + 25000;
      if (user.subscription_plan === "AGENCY") return acc + 50000;
      return acc;
    }, 0);

    // Revenus loyers totaux
    const totalRentRevenue = (rentPaymentsRes.data ?? []).reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    // Taux conversion estimé (visiteurs → inscrits)
    const visiteursSemaine = 3450;
    const tauxConversionVisiteurInscrit =
      visiteursSemaine > 0
        ? Math.round((totalUsers / visiteursSemaine) * 100)
        : 0;

    // Taux conversion inscrits → payants
    const tauxConversionInscritPayant =
      totalUsers > 0
        ? Math.round((payingUsers.length / totalUsers) * 100)
        : 0;

    // Nouveaux utilisateurs ce mois
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: newUsersThisMonth } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      // .gte("created_at", startOfMonth.toISOString()); // TODO: Remettre le bon nom de colonne une fois découvert

    return {
      visiteursSemaine,
      tauxConversionVisiteurInscrit,
      tauxConversionInscritPayant,
      churnMensuel: 1.2,
      mrr,
      totalRentRevenue,
      totalUsers,
      totalProperties: propertiesRes.count ?? 0,
      totalReservations: reservationsRes.count ?? 0,
      newUsersThisMonth: newUsersThisMonth ?? 0,
    };
  } catch (error) {
    console.error("Erreur fetchAdminKPIs:", error);
    return {
      visiteursSemaine: 0,
      tauxConversionVisiteurInscrit: 0,
      tauxConversionInscritPayant: 0,
      churnMensuel: 0,
      mrr: 0,
      totalRentRevenue: 0,
      totalUsers: 0,
      totalProperties: 0,
      totalReservations: 0,
      newUsersThisMonth: 0,
    };
  }
}

// ─── Utilisateurs ─────────────────────────────────────────────────────────────
export async function fetchAdminUsers() {
  try {
    console.log('[fetchAdminUsers] Début requête...');

    const admin = getSupabaseAdmin();

    const { data: sample } = await admin
      .from('profiles')
      .select('*')
      .limit(1);

    console.log('[Colonnes profiles]:', Object.keys(sample?.[0] || {}));

    const { data, error, count } = await admin
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('id', { ascending: false });

    console.log('[fetchAdminUsers] Résultat:', {
      count,
      dataLength: data?.length,
      error: error?.message,
    });

    if (error) {
      console.error('[fetchAdminUsers] ERREUR Supabase:', error);
      return { users: [], count: 0, error: error.message };
    }

    return {
      users: data || [],
      count: count || 0,
      error: null,
    };
  } catch (err) {
    console.error('[fetchAdminUsers] EXCEPTION:', err);
    return {
      users: [],
      count: 0,
      error: String(err),
    };
  }
}

export async function suspendUser(userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ status: "suspended" })
      .eq("id", userId);

    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error("Erreur suspendUser:", error);
    return { ok: false, error: String(error) };
  }
}

export async function reactivateUser(userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ status: "active" })
      .eq("id", userId);

    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error("Erreur reactivateUser:", error);
    return { ok: false, error: String(error) };
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error("Erreur deleteUser:", error);
    return { ok: false, error: String(error) };
  }
}

// ─── Biens Immobiliers ────────────────────────────────────────────────────────
export async function fetchAdminProperties() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("properties")
      .select(`
        *,
        profiles (
          id,
          full_name,
          whatsapp_number,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erreur fetchAdminProperties:", error);
    return [];
  }
}

export async function approveProperty(propertyId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("properties")
      .update({ status: "active", is_published: true })
      .eq("id", propertyId);

    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error("Erreur approveProperty:", error);
    return { ok: false, error: String(error) };
  }
}

export async function suspendProperty(propertyId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("properties")
      .update({ status: "suspended", is_published: false })
      .eq("id", propertyId);

    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error("Erreur suspendProperty:", error);
    return { ok: false, error: String(error) };
  }
}

export async function deleteProperty(propertyId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("properties")
      .delete()
      .eq("id", propertyId);

    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error("Erreur deleteProperty:", error);
    return { ok: false, error: String(error) };
  }
}

// ─── Transactions ─────────────────────────────────────────────────────────────
export async function fetchAdminTransactions() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Récupère les paiements de loyer avec infos du locataire
    const { data: rentPayments, error: rentError } = await supabaseAdmin
      .from("rent_payments")
      .select(`
        id,
        amount,
        status,
        due_date,
        created_at,
        tenant_id,
        property_id,
        profiles (
          full_name,
          whatsapp_number,
          email
        )
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (rentError) throw rentError;

    // Formatage uniforme
    const formatted = (rentPayments || []).map((p: any) => ({
      id: p.id,
      type: "LOYER",
      amount: p.amount,
      status: p.status,
      created_at: p.created_at,
      due_date: p.due_date,
      user_name: p.profiles?.full_name ?? "Inconnu",
      user_whatsapp: p.profiles?.whatsapp_number ?? "-",
      user_email: p.profiles?.email ?? "-",
    }));

    return formatted;
  } catch (error) {
    console.error("Erreur fetchAdminTransactions:", error);
    return [];
  }
}

// ─── Vérification Admin ───────────────────────────────────────────────────────
export async function checkIsAdmin(
  userId: string,
  userEmail?: string
): Promise<boolean> {
  // 1. Vérification par email CTO (priorité absolue)
  const ctoEmails = [
    "gabrieletchisse@gmail.com",
    "mannerentcontact@gmail.com",
  ];
  if (userEmail && ctoEmails.includes(userEmail)) {
    return true;
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    return data?.is_admin || false;
  } catch (error) {
    console.error("Erreur checkIsAdmin (DB):", error);
    return false;
  }
}
