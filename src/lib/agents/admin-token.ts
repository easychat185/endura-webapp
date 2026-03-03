import { createHmac } from "crypto";

const TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Sign an admin token with HMAC-SHA256 and an issued-at timestamp.
 * Format: `<issuedAt>.<hmac>`
 */
export function signAdminToken(secret: string): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `admin:${issuedAt}`;
  const hmac = createHmac("sha256", secret).update(payload).digest("hex");
  return `${issuedAt}.${hmac}`;
}

/**
 * Verify an admin token: check HMAC signature and TTL (7 days).
 * Returns true if the token is valid and not expired.
 */
export function verifyAdminToken(token: string, secret: string): boolean {
  const dotIdx = token.indexOf(".");
  if (dotIdx === -1) return false;

  const issuedAtStr = token.slice(0, dotIdx);
  const providedHmac = token.slice(dotIdx + 1);

  const issuedAt = Number(issuedAtStr);
  if (!Number.isFinite(issuedAt)) return false;

  // Check TTL
  const now = Math.floor(Date.now() / 1000);
  if (now - issuedAt > TTL_SECONDS) return false;
  if (issuedAt > now + 60) return false; // reject future tokens (1-min grace)

  // Recompute HMAC
  const payload = `admin:${issuedAtStr}`;
  const expectedHmac = createHmac("sha256", secret).update(payload).digest("hex");

  // Constant-time comparison
  if (providedHmac.length !== expectedHmac.length) return false;
  let mismatch = 0;
  for (let i = 0; i < providedHmac.length; i++) {
    mismatch |= providedHmac.charCodeAt(i) ^ expectedHmac.charCodeAt(i);
  }
  return mismatch === 0;
}
