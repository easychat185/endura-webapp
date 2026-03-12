import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { decrypt } from "@/lib/crypto";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const FROM_EMAIL = "Endura <onboarding@resend.dev>";
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

    // 4. Send the PDF email
    console.log(`[confirm] Sending PDF to ${email}...`);
    const pdfPaths = [
      resolve(process.cwd(), "public", "endura-program-guide.pdf"),
      resolve(process.cwd(), "endura-program-guide.pdf"),
    ];

    let pdfBuffer: Buffer | null = null;
    for (const p of pdfPaths) {
      if (existsSync(p)) {
        pdfBuffer = readFileSync(p);
        console.log(`[confirm] PDF found at ${p} (${pdfBuffer.length} bytes)`);
        break;
      }
    }

    if (pdfBuffer && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Your Endura Program Guide is here",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #333;">
            <h1 style="font-size: 24px; font-weight: 300; color: #1a1a1a; margin-bottom: 16px;">
              Welcome to Endura
            </h1>
            <p style="font-size: 16px; line-height: 1.7; color: #555; margin-bottom: 24px;">
              Your email is confirmed! Attached is your complete program guide —
              <strong>First Steps to Sexual Mastery</strong> — with 5 levels and
              15 guided exercises you can start practicing today.
            </p>
            <p style="font-size: 16px; line-height: 1.7; color: #555; margin-bottom: 24px;">
              Take your time with it. Start from Level 1 and work through each
              exercise at your own pace. Consistency matters more than speed.
            </p>
            <p style="font-size: 16px; line-height: 1.7; color: #555; margin-bottom: 24px;">
              We'll send you another email when the full app is live. Until then,
              the guide has everything you need to begin.
            </p>
            <p style="font-size: 14px; color: #999; margin-top: 40px;">
              — The Endura Team
            </p>
          </div>
        `,
        attachments: [
          {
            filename: "Endura-Program-Guide.pdf",
            content: pdfBuffer,
          },
        ],
      });

      if (error) {
        console.error(`[confirm] Resend PDF error:`, error);
      } else {
        console.log(`[confirm] PDF email sent OK: ${data?.id}`);
      }
    } else {
      console.warn(`[confirm] PDF not found or RESEND_API_KEY missing — skipping PDF email`);
    }

    return NextResponse.redirect(new URL("/confirmed?status=success", req.url));
  } catch (err) {
    console.error("[confirm] Unexpected error:", err);
    return NextResponse.redirect(new URL("/confirmed?status=error", req.url));
  }
}
