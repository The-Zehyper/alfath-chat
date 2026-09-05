import { NextResponse } from "next/server";
import { makeSession, normalizeUsername, setSessionCookie, verifyPassword } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { username: raw, password } = await request.json();
    const username = normalizeUsername(String(raw || ""));
    const { data } = await supabaseAdmin().from("users").select("id,username,display_name,avatar_url,created_at,password_hash").eq("username", username).maybeSingle();
    if (!data || !verifyPassword(String(password || ""), data.password_hash)) return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    setSessionCookie(makeSession(data.id));
    const { password_hash: _ignored, ...user } = data;
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
}
