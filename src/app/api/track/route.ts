import { NextRequest, NextResponse } from "next/server";
import { userAgent } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  const ua = userAgent(req);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip");
  const referrer = req.headers.get("referer") || null;

  let country: string | null = null;
  let city: string | null = null;

  if (ip && ip !== "::1" && ip !== "127.0.0.1") {
    try {
      const geo = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,status`, {
        signal: AbortSignal.timeout(2000),
      }).then((r) => r.json());
      if (geo.status === "success") {
        country = geo.country ?? null;
        city = geo.city ?? null;
      }
    } catch {
      // geo lookup failed, continue without it
    }
  }

  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      country,
      city,
      browser: ua.browser.name ?? null,
      os: ua.os.name ?? null,
      device: ua.device.type ?? "desktop",
      referrer,
    }),
  });

  const [row] = await insertRes.json();

  return NextResponse.json({ ok: true, session_id: row?.id ?? null });
}
