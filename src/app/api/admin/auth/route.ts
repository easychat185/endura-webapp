import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

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

    const a = Buffer.from(String(secret));
    const b = Buffer.from(expected);

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json(
        { error: "Invalid secret" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_token", secret, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/api/agents",
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
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/agents",
    maxAge: 0,
  });
  return res;
}
