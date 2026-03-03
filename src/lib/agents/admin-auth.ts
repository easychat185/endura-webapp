import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { verifyAdminToken } from "./admin-token";

/**
 * Check if a request has valid admin authentication.
 * - x-admin-secret header: compared via timingSafeEqual against AGENT_ADMIN_SECRET
 * - admin_token cookie: verified via HMAC signature + TTL
 */
export function checkAdminAuth(request: NextRequest): boolean {
  const expected = process.env.AGENT_ADMIN_SECRET;
  if (!expected) return false;

  // Check header first (raw secret, used by scripts/cron)
  const headerSecret = request.headers.get("x-admin-secret");
  if (headerSecret) {
    const a = Buffer.from(headerSecret);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  // Check HMAC-signed cookie (used by browser sessions)
  const cookieToken = request.cookies.get("admin_token")?.value;
  if (cookieToken) {
    return verifyAdminToken(cookieToken, expected);
  }

  return false;
}

/**
 * Returns a 401 response if not authenticated, or null if auth is valid.
 */
export function requireAdminAuth(request: NextRequest): NextResponse | null {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
