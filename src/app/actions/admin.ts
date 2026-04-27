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
    const { count: totalProperties } = await supabaseAdmin
      .from("properties")
      .select("*", { count: "exact", head: true });

    return {
      visiteursSemaine,
      tauxConversionVisiteurInscrit,
      tauxConversionInscritPayant,
      churnMensuel: 1.2,
      mrr,
      totalUsers: totalUsers || 0,
      totalProperties: totalProperties || 0
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
      totalProperties: 0
    };
  }
}

export async function fetchAdminUsers() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erreur fetchAdminUsers:", error);
    return [];
  }
}

export async function fetchAdminProperties() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("properties")
      .select("*");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erreur fetchAdminProperties:", error);
    return [];
  }
}

export async function fetchAdminTransactions() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("rent_payments")
      .select("*")
      .limit(50);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erreur fetchAdminTransactions:", error);
    return [];
  }
}

// Version ultra-sécurisée pour le CTO : vérifie l'email AVANT de tenter la base de données
export async function checkIsAdmin(userId: string, userEmail?: string): Promise<boolean> {
  // 1. PRIORITÉ ABSOLUE : Vérification par Email (ne dépend pas de la clé secrète Vercel)
  const ctoEmails = ['gabrieletchisse@gmail.com', 'mannerentcontact@gmail.com'];
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
