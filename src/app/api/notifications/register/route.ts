import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { token, platform } = await request.json();
    if (!token || !platform) {
      return NextResponse.json({ error: "Missing token or platform" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await supabase.from("device_tokens").upsert(
      { user_id: user.id, token, platform },
      { onConflict: "user_id,token" }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to register token" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    if (body.token) {
      await supabase
        .from("device_tokens")
        .delete()
        .eq("user_id", user.id)
        .eq("token", body.token);
    } else {
      await supabase.from("device_tokens").delete().eq("user_id", user.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to unregister" }, { status: 500 });
  }
}
