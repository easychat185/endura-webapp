import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { signAdminToken } from "@/lib/agents/admin-token";

function hmacDigest(value: string): Buffer {
  return createHmac("sha256", "endura-auth").update(value).digest();
}

export async function POST(request: NextRequest) {
  const expected = process.env.AGENT_ADMIN_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const { secret } = await request.json();

    if (!secret) {
      return NextResponse.json(
        { error: "Invalid secret" },
        { status: 401 }
      );
    }

    const { timingSafeEqual } = await import("crypto");
    const a = hmacDigest(String(secret));
    const b = hmacDigest(expected);

    if (!timingSafeEqual(a, b)) {
      return NextResponse.json(
        { error: "Invalid secret" },
        { status: 401 }
      );
    }

    const isProduction = process.env.NODE_ENV === "production";
    const token = signAdminToken(expected);
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const isProduction = process.env.NODE_ENV === "production";
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
