// ─── Internet Packages Comparison — Types ─────────────────────────────────────
//
// v1 scope: Home Broadband only. `category` already distinguishes
// 'mobile-broadband' so that can be switched on later without a schema
// change — just add packages with category: 'mobile-broadband' and a page
// to render them.

export type BroadbandCategory = 'home-broadband' | 'mobile-broadband';

/** Underlying connection technology. */
export type ConnectionType = 'Fiber' | 'ADSL' | '4G' | '5G' | 'Satellite';

export type BillingType = 'Prepaid' | 'Postpaid';

/**
 * Two package shapes, matching how Sri Lankan ISPs actually sell home
 * broadband (SLT's own site literally labels the capped tier "Data Bundle"):
 *  - 'unlimited'  — no monthly data cap. Tiers are differentiated by SPEED
 *                    only (e.g. Rs. 5,900 for 100/50 Mbps, Rs. 9,900 for
 *                    200/100 Mbps). Some prepaid "unlimited" packs are sold
 *                    by speed cap alone (e.g. "Unlimited — 2 Mbps").
 *  - 'databundle' — a fixed monthly (or period) data allowance at a given
 *                    speed. What happens after the cap (throttle to a lower
 *                    speed, top-up charge, or cut-off) goes in `afterCap`.
 */
export type PackageKind = 'unlimited' | 'databundle';

export interface ISP {
  id: string;
  /** Full display name, e.g. "SLT (Sri Lanka Telecom)" */
  name: string;
  /** Short form used in compact UI, e.g. "SLT" */
  shortName: string;
  /** Path under /public, e.g. "/logos/slt.svg". Supply the real brand asset —
   *  none are bundled here. The UI falls back to a monogram badge if the
   *  file is missing (see Logo component in page.tsx). */
  logo: string;
  website: string;
  /**
   * Placeholder accent color for card borders/badges — NOT verified against
   * each ISP's official brand guidelines. Swap for the real brand hex if you
   * want pixel-accurate branding.
   */
  accentColor: string;
}

interface BasePackage {
  id: string;
  ispId: string;
  category: BroadbandCategory;
  kind: PackageKind;
  connectionType: ConnectionType;
  billingType: BillingType;
  /** Package name as the ISP markets it, e.g. "Unlimited Home", "Home Wi-Fi 100GB" */
  name: string;
  /** Omit when the ISP genuinely doesn't publish a download speed (e.g. some 4G bundles). */
  downloadMbps?: number;
  /** Omit when the ISP doesn't publish an upload figure. */
  uploadMbps?: number;
  /**
   * Deep link to this exact plan's page on the ISP's own site (where someone
   * could actually sign up for it), if published. Falls back to the ISP's
   * homepage (`ISP.website`) when omitted — fill this in as you verify each
   * plan's real URL rather than guessing one; a wrong link is worse than no
   * link.
   */
  planUrl?: string;
  /** Monthly price in LKR, as the ISP's own price list states it. */
  price: number;
  /** Whether `price` already includes tax, per how the ISP displays it. */
  priceIncludesTax: boolean;
  /** One-off connection/installation charge, if published. */
  installationFee?: number;
  /** Minimum contract length in months, if any. */
  contractMonths?: number;
  /** Free-text caveats: FUP behaviour, bundled extras, promo conditions, etc. */
  notes?: string;
  /**
   * ISO date this entry was last checked against the ISP's own price list.
   * `null` flags "unverified / approximate — confirm before publishing",
   * which the UI shows as a small badge.
   */
  lastVerified: string | null;
}

export interface UnlimitedPackage extends BasePackage {
  kind: 'unlimited';
}

export interface DataBundlePackage extends BasePackage {
  kind: 'databundle';
  dataCapGB: number;
  /** Does unused data roll over to the next month? */
  rollover?: boolean;
  /** What happens once the cap is hit, e.g. "Throttled to 1 Mbps", "Rs. 10/GB top-up". */
  afterCap?: string;
}

export type InternetPackage = UnlimitedPackage | DataBundlePackage;

export interface InternetPackagesData {
  isps: ISP[];
  packages: InternetPackage[];
}