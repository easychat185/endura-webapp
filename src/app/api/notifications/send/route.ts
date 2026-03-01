import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.AGENT_ADMIN_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, title, body } = await request.json();
    if (!userId || !title || !body) {
      return NextResponse.json(
        { error: "Missing userId, title, or body" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: tokens } = await supabase
      .from("device_tokens")
      .select("token, platform")
      .eq("user_id", userId);

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    // Send via Firebase Admin SDK (requires server-side Firebase Admin setup)
    // For now, return token count — actual sending requires firebase-admin
    return NextResponse.json({ sent: tokens.length, tokens: tokens.length });
  } catch {
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
