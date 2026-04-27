/**
 * business-rules.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Toutes les règles métier de Manne Rent.
 * Ce fichier est importé uniquement par les Server Actions (jamais par le client).
 * Il constitue l'unique source de vérité pour :
 *   - Les limites de publication par plan
 *   - Les taux de commission
 *   - Les messages d'erreur officiels en français
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type SubscriptionPlan = 'FREE' | 'PRO' | 'AGENCY';
export type ListingKind      = 'property' | 'vehicle';
export type VehicleCategory  = 'Voiture' | 'Minibus';

// ─── Plan Limits ──────────────────────────────────────────────────────────────

interface PlanLimits {
  properties: number;   // Max logements actifs
  voiture: number;      // Max voitures actives
  minibus: number;      // Max minibus actifs
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  FREE:   { properties: 1,        voiture: 1,        minibus: 1 },
  PRO:    { properties: 5,        voiture: 5,        minibus: 5 },
  AGENCY: { properties: Infinity, voiture: Infinity, minibus: Infinity },
};

// ─── Commission Rates ─────────────────────────────────────────────────────────

interface CommissionConfig {
  rate: number;         // Fraction (0.05 = 5%)
  paidBy: 'tenant' | 'owner';
  description: string;
}

export const COMMISSION_RULES: {
  property: Record<SubscriptionPlan, CommissionConfig>;
  voiture:  Record<SubscriptionPlan, CommissionConfig>;
  minibus:  Record<SubscriptionPlan, CommissionConfig>;
} = {
  property: {
    FREE:   { rate: 0.50, paidBy: 'tenant',  description: '50% du loyer mensuel payé par le locataire' },
    PRO:    { rate: 0.50, paidBy: 'tenant',  description: '50% du loyer mensuel payé par le locataire' },
    AGENCY: { rate: 0.50, paidBy: 'tenant',  description: '50% du loyer mensuel payé par le locataire' },
  },
  voiture: {
    FREE:   { rate: 0.05, paidBy: 'tenant',  description: '5% du montant total payé par le locataire' },
    PRO:    { rate: 0.05, paidBy: 'owner',   description: '5% de bonus par location versé au propriétaire' },
    AGENCY: { rate: 0.05, paidBy: 'tenant',  description: '5% de bonus payé par le locataire' },
  },
  minibus: {
    FREE:   { rate: 0.07, paidBy: 'tenant',  description: '7% du montant total payé par le locataire' },
    PRO:    { rate: 0.05, paidBy: 'owner',   description: '5% de bonus par location versé au propriétaire' },
    AGENCY: { rate: 0.05, paidBy: 'tenant',  description: '5% de bonus payé par le locataire' },
  },
};

// ─── Feature Flags ────────────────────────────────────────────────────────────

export const PLAN_FEATURES: Record<SubscriptionPlan, {
  verified_badge: boolean;
  stats: boolean;
  priority_search: boolean;
  multi_property_dashboard: boolean;
  whatsapp_only: boolean;
}> = {
  FREE:   { verified_badge: false, stats: false, priority_search: false, multi_property_dashboard: false, whatsapp_only: true  },
  PRO:    { verified_badge: true,  stats: true,  priority_search: false, multi_property_dashboard: false, whatsapp_only: false },
  AGENCY: { verified_badge: true,  stats: true,  priority_search: true,  multi_property_dashboard: true,  whatsapp_only: false },
};

// ─── Error Messages ───────────────────────────────────────────────────────────

export const LIMIT_MESSAGES = {
  FREE_property:   'Vous avez atteint le quota maximal de votre offre Gratuite. Élevez votre compte vers l\'offre PRO pour gérer jusqu\'à 5 propriétés.',
  FREE_voiture:    'Quota maximal atteint (offre Gratuite). Découvrez l\'offre PRO pour élargir votre flotte jusqu\'à 5 véhicules.',
  FREE_minibus:    'Quota maximal atteint (offre Gratuite). Découvrez l\'offre PRO pour élargir votre flotte jusqu\'à 5 minibus.',
  PRO_property:    'Capacité maximale atteinte (offre PRO). Passez à l\'offre Agence pour une gestion illimitée de votre portefeuille.',
  PRO_voiture:     'Capacité maximale atteinte (offre PRO). Passez à l\'offre Agence pour une flotte de véhicules illimitée.',
  PRO_minibus:     'Capacité maximale atteinte (offre PRO). Passez à l\'offre Agence pour une flotte de minibus illimitée.',
  unavailable:     'Cette résidence n\'est plus disponible pour les dates sélectionnées.',
  payment_failed:  'La transaction n\'a pu aboutir. Veuillez vérifier vos fonds disponibles et réessayez.',
  not_auth:        'Authentification requise pour effectuer cette opération.',
  generic:         'Une interruption momentanée est survenue. Nous rétablissons l\'accès.',
} as const;

export const APP_ERRORS = {
  NETWORK: {
    title: 'Connexion interrompue',
    message: 'Une difficulté technique empêche la liaison avec nos serveurs. Nous rétablissons l\'accès à vos données.',
    action: 'Actualiser'
  },
  PAYMENT: {
    title: 'Transaction interrompue',
    message: 'Le virement n\'a pu aboutir. Veuillez vérifier la validité de votre compte Mobile Money ou vos fonds disponibles.',
    action: 'Réessayer'
  },
  AUTH: {
    title: 'Session expirée',
    message: 'Pour votre sécurité, votre session a été clôturée. Veuillez vous identifier à nouveau.',
    action: 'Se connecter'
  },
  VALIDATION: {
    title: 'Informations incomplètes',
    message: 'Certaines précisions sont nécessaires pour finaliser votre demande.',
    action: 'Corriger'
  },
  GENERIC: {
    title: 'Service momentanément indisponible',
    message: 'Une interruption technique est survenue. Nos équipes techniques interviennent pour un rétablissement rapide.',
    action: 'Réessayer'
  }
} as const;

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Determines the limit message key based on plan + listing type.
 */
export function getLimitMessageKey(
  plan: SubscriptionPlan,
  listingType: 'property' | 'voiture' | 'minibus',
): keyof typeof LIMIT_MESSAGES {
  return `${plan}_${listingType}` as keyof typeof LIMIT_MESSAGES;
}

/**
 * Checks whether an owner has reached their plan's listing limit.
 * Returns null if OK, or the blocking error message if limit reached.
 */
export function checkPlanLimit(
  plan: SubscriptionPlan,
  listingType: 'property' | 'voiture' | 'minibus',
  currentCount: number,
): string | null {
  const limit = plan === 'AGENCY' ? Infinity :
    listingType === 'property' ? PLAN_LIMITS[plan].properties :
    listingType === 'voiture'  ? PLAN_LIMITS[plan].voiture :
    PLAN_LIMITS[plan].minibus;

  if (currentCount >= limit) {
    const key = getLimitMessageKey(plan, listingType);
    return LIMIT_MESSAGES[key] ?? LIMIT_MESSAGES.generic;
  }
  return null; // No limit reached
}

/**
 * Calculates commission for a reservation.
 * Returns { rate, amount, paidBy, description }
 */
export function calculateCommission(
  plan: SubscriptionPlan,
  listingType: 'property' | 'voiture' | 'minibus',
  totalPrice: number,
): { rate: number; amount: number; paidBy: string; description: string } {
  const config = COMMISSION_RULES[listingType][plan];
  return {
    rate:        config.rate,
    amount:      Math.round(totalPrice * config.rate),
    paidBy:      config.paidBy,
    description: config.description,
  };
}

/**
 * Normalizes vehicle category string to commission key.
 */
export function vehicleCategoryToCommissionKey(
  category: string | null | undefined,
): 'voiture' | 'minibus' {
  if (!category) return 'voiture';
  return category.toLowerCase().includes('minibus') ? 'minibus' : 'voiture';
}

// ─── Image Limits ─────────────────────────────────────────────────────────────

/**
 * Nombre maximum de photos autorisées selon le type de bien.
 * Utilisé côté client dans le formulaire d'ajout.
 */
export const IMAGE_LIMITS = {
  logement: 10,   // Appartement, Villa, Studio, Bureau, Chambre, Hôtel
  parcelle:  3,   // Parcelle (terrain)
  vehicule:  8,   // Voiture ou Minibus
} as const;

export type ImageLimitKind = keyof typeof IMAGE_LIMITS;

// ─── Commission Vente de Parcelle ─────────────────────────────────────────────

/**
 * Règles de commission appliquées lors de l'achat d'une parcelle.
 *
 * Structure du flux financier :
 *   Acquéreur paie  : prix_parcelle × (1 + 0.03) = +3%
 *   Propriétaire reçoit : prix_parcelle × (1 - 0.01) = -1%
 *   Manne Rent conserve : 3% + 1% = 4% du prix parcelle
 */
export const PARCEL_COMMISSION = {
  buyer_surcharge_rate: 0.03,
  owner_deduction_rate: 0.01,
  platform_total_rate:  0.04,
  description_buyer:
    'Commission plateforme acquéreur (+3% du prix de la parcelle)',
  description_owner:
    'Commission plateforme propriétaire (-1% du prix de la parcelle)',
} as const;

export interface ParcelCommissionBreakdown {
  /** Prix de base de la parcelle (FCFA) */
  basePrice:      number;
  /** Majoration acquéreur (+3%) */
  buyerSurcharge: number;
  /** Ce que l'acquéreur paie réellement */
  buyerPays:      number;
  /** Déduction propriétaire (-1%) */
  ownerDeduction: number;
  /** Ce que le propriétaire reçoit */
  ownerReceives:  number;
  /** Gain total Manne Rent */
  platformFee:    number;
}

/**
 * Calcule la ventilation des commissions pour une parcelle.
 * @param parcelPrice  Prix affiché de la parcelle en FCFA
 */
export function calculateParcelCommission(
  parcelPrice: number,
): ParcelCommissionBreakdown {
  const buyerSurcharge = Math.round(parcelPrice * PARCEL_COMMISSION.buyer_surcharge_rate);
  const ownerDeduction = Math.round(parcelPrice * PARCEL_COMMISSION.owner_deduction_rate);
  return {
    basePrice:      parcelPrice,
    buyerSurcharge,
    buyerPays:      parcelPrice + buyerSurcharge,
    ownerDeduction,
    ownerReceives:  parcelPrice - ownerDeduction,
    platformFee:    buyerSurcharge + ownerDeduction,
  };
}

// ─── Pénalités de Loyer ───────────────────────────────────────────────────────

/**
 * Règles de pénalité applicables en cas de retard de paiement du loyer.
 *
 * Calendrier de paiement :
 *   - Fenêtre de paiement normale : du 23 au 05 de chaque mois
 *   - Retard accordé jusqu'au 10 de chaque mois avant 20h00
 *   - Après le 10 à 20h00 : pénalité automatique de 1 000 FCFA
 *   - Si toujours impayé après visite agent : frais selon zone géographique
 *
 * Zones :
 *   - Abomey-Calavi, Cotonou, Porto-Novo → 3 000 FCFA
 *   - Allada → Parakou (autres villes)   → 5 000 FCFA
 */
export const RENT_PENALTY_RULES = {
  payment_day_start:      23,    // Premier jour autorisé (mois précédent)
  payment_day_end:        5,     // Dernier jour autorisé (mois en cours)
  grace_period_end:       10,    // Retard accordé jusqu'au 10
  payment_hour_deadline:  20,    // 20h00 (heure limite du 10)
  late_fee_amount:      1_000,   // FCFA — pénalité retard automatique
  agent_visit_zones: {
    'Abomey-Calavi': 3_000,
    'Cotonou':        3_000,
    'Porto-Novo':     3_000,
  } as Record<string, number>,
  agent_visit_default: 5_000,    // FCFA — zones hors liste ci-dessus
} as const;

export type RentPenaltyType = 'late_fee' | 'agent_visit';

/**
 * Retourne le montant des frais de déplacement agent selon la ville.
 */
export function getAgentVisitFee(city: string | null | undefined): number {
  if (!city) return RENT_PENALTY_RULES.agent_visit_default;
  const normalized = city.trim();
  return (
    RENT_PENALTY_RULES.agent_visit_zones[normalized] ??
    RENT_PENALTY_RULES.agent_visit_default
  );
}

/**
 * Vérifie si la date/heure actuelle justifie une pénalité de retard.
 * Retourne true si la période de grâce est dépassée (après le 10 à 20h00).
 */
export function isRentPaymentLate(now: Date = new Date()): boolean {
  const day  = now.getDate();
  const hour = now.getHours();
  // Pénalité appliquée après le 10 du mois à 20h00
  if (day > RENT_PENALTY_RULES.grace_period_end) return true;
  if (day === RENT_PENALTY_RULES.grace_period_end && hour >= RENT_PENALTY_RULES.payment_hour_deadline) return true;
  return false;
}
