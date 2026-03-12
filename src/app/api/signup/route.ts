import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { encrypt } from "@/lib/crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const FROM_EMAIL = "Endura <onboarding@resend.dev>";

export async function POST(req: NextRequest) {
  try {
    const { email, allows_marketing } = await req.json();
    console.log(`[signup] Received signup request for ${email}`);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("[signup] RESEND_API_KEY is not set");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    // 1. Save to Supabase with confirmed=false
    console.log(`[signup] Saving ${email} to Supabase (unconfirmed)...`);
    const token = encrypt(JSON.stringify({ email, ts: Date.now() }));
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/early_access_signups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email,
        allows_marketing,
        confirmed: false,
        confirmation_token: token,
        token_expires_at: expiresAt,
      }),
    });

    if (!supaRes.ok) {
      const data = await supaRes.json().catch(() => null);
      console.error(`[signup] Supabase error: ${supaRes.status}`, data);
      if (supaRes.status === 409 || data?.code === "23505") {
        return NextResponse.json({ error: "already_registered" }, { status: 409 });
      }
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    console.log(`[signup] Saved to Supabase OK`);

    // 2. Build confirmation URL
    const baseUrl = req.nextUrl.origin;
    const confirmUrl = `${baseUrl}/api/confirm?token=${encodeURIComponent(token)}`;
    console.log(`[signup] Confirmation URL: ${confirmUrl}`);

    // 3. Send confirmation email (NOT the PDF yet)
    console.log(`[signup] Sending confirmation email to ${email}...`);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Confirm your email to get the Endura Program Guide",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #333;">
          <h1 style="font-size: 24px; font-weight: 300; color: #1a1a1a; margin-bottom: 16px;">
            One more step
          </h1>
          <p style="font-size: 16px; line-height: 1.7; color: #555; margin-bottom: 24px;">
            Thanks for signing up for Endura. Please confirm your email address
            to receive your free program guide — <strong>First Steps to Sexual Mastery</strong>.
          </p>
          <a href="${confirmUrl}" style="display: inline-block; background: #b8860b; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 500;">
            Confirm my email
          </a>
          <p style="font-size: 14px; line-height: 1.7; color: #999; margin-top: 32px;">
            This link expires in 24 hours. If you didn't sign up for Endura, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error(`[signup] Resend error:`, error);
      return NextResponse.json({ success: true, warning: "Confirmation email failed to send" });
    }

    console.log(`[signup] Confirmation email sent OK: ${data?.id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[signup] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: String(err) },
      { status: 500 }
    );
  }
}
