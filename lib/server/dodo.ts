import "server-only";
import DodoPayments from "dodopayments";

let client: DodoPayments | null = null;

export function dodo() {
  if (client) return client;
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) throw new Error("DODO_PAYMENTS_API_KEY is not set");
  client = new DodoPayments({
    bearerToken,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode",
  });
  return client;
}

export const lifetimeProductId = () => process.env.DODO_LIFETIME_PRODUCT_ID ?? "";
export const monthlyProductId = () => process.env.DODO_MONTHLY_PRODUCT_ID ?? "";
