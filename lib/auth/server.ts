import { createNeonAuth } from "@neondatabase/auth/next/server";

const fallbackSecret = "dev-only-placeholder-secret-change-me!!";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || "https://auth.unconfigured.invalid/neondb/auth",
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET || fallbackSecret,
    sameSite: "lax",
  },
});

export function isAuthConfigured() {
  return Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET);
}
