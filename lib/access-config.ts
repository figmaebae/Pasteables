// Shared by the server routes and the browser. No secrets here.
export const FREE_PACKS = ["mascot", "emoticons"] as const;
export const PAID_PACKS = ["ghost", "mushroom", "dumpling", "clouds"] as const;
/** Stickers a visitor without access can copy and customize, counted across a free pack in the order shown. */
export const FREE_STICKERS = 10;
/** Different icons a visitor without access can copy or download each day. */
export const FREE_ICONS_PER_DAY = 3;
/** Buyers who get the one-time price. Later buyers are offered the monthly plan. */
export const LIFETIME_SEATS = 25;

export type Plan = "lifetime" | "monthly";

export interface Offer {
  kind: "lifetime" | "monthly" | "closed";
  /** Price in the smallest currency unit (paise for INR). */
  amount?: number;
  currency?: string;
  /** One-time seats still open. */
  seatsLeft: number;
  seats: number;
}

export interface AccessInfo {
  signedIn: boolean;
  email?: string;
  active: boolean;
  plan?: Plan;
  licenseKey?: string;
  offer: Offer;
}
