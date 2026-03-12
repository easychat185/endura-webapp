import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/crypto";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/confirmed?status=invalid", req.url));
  }

  try {
    // 1. Decrypt and validate token
    console.log(`[confirm] Decrypting token...`);
    const payload = JSON.parse(decrypt(decodeURIComponent(token)));
    const { email, ts } = payload;

    if (!email || !ts) {
      console.error("[confirm] Invalid token payload:", payload);
      return NextResponse.redirect(new URL("/confirmed?status=invalid", req.url));
    }

    const age = Date.now() - ts;
    if (age > TOKEN_MAX_AGE_MS) {
      console.error(`[confirm] Token expired. Age: ${Math.round(age / 3600000)}h`);
      return NextResponse.redirect(new URL("/confirmed?status=expired", req.url));
    }

    console.log(`[confirm] Token valid for ${email}`);

    // 2. Check if already confirmed
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/early_access_signups?email=eq.${encodeURIComponent(email)}&select=confirmed`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    const rows = await checkRes.json();
    if (rows?.[0]?.confirmed) {
      console.log(`[confirm] ${email} already confirmed`);
      return NextResponse.redirect(new URL("/confirmed?status=already", req.url));
    }

    // 3. Mark as confirmed in Supabase
    console.log(`[confirm] Confirming ${email} in Supabase...`);
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/early_access_signups?email=eq.${encodeURIComponent(email)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          confirmed: true,
          confirmation_token: null,
          token_expires_at: null,
        }),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.text();
      console.error(`[confirm] Supabase update error:`, err);
      return NextResponse.redirect(new URL("/confirmed?status=error", req.url));
    }
    console.log(`[confirm] ${email} confirmed in Supabase`);

    return NextResponse.redirect(new URL("/endura-program-guide.pdf", req.url));
  } catch (err) {
    console.error("[confirm] Unexpected error:", err);
    return NextResponse.redirect(new URL("/confirmed?status=error", req.url));
  }
}
