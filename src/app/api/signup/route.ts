import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { resolve } from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// TODO: Change to your custom domain once verified in Resend
const FROM_EMAIL = "Endura <onboarding@resend.dev>";

export async function POST(req: NextRequest) {
  try {
    const { email, allows_marketing } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Save to Supabase
    const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/early_access_signups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email, allows_marketing }),
    });

    if (!supaRes.ok) {
      const data = await supaRes.json().catch(() => null);
      if (supaRes.status === 409 || data?.code === "23505") {
        return NextResponse.json({ error: "already_registered" }, { status: 409 });
      }
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // 2. Send the PDF via Resend
    const pdfPath = resolve(process.cwd(), "endura-program-guide.pdf");
    const pdfBuffer = readFileSync(pdfPath);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Your Endura Program Guide is here",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #333;">
          <h1 style="font-size: 24px; font-weight: 300; color: #1a1a1a; margin-bottom: 16px;">
            Welcome to Endura
          </h1>
          <p style="font-size: 16px; line-height: 1.7; color: #555; margin-bottom: 24px;">
            Thanks for signing up. Attached is your complete program guide —
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
