import { NextResponse } from "next/server";
import { hashPassword, makeSession, normalizeUsername, setSessionCookie, validUsername } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const usernameRaw = String(body.username || "").trim();
    const password = String(body.password || "");
    const username = normalizeUsername(usernameRaw);
    if (!validUsername(username)) return NextResponse.json({ error: "Username 3-24 karakter, hanya huruf, angka, dan underscore." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });

    const admin = supabaseAdmin();
    const userId = randomUUID();
    const { error } = await admin.from("users").insert({ id: userId, username, display_name: usernameRaw, password_hash: hashPassword(password) });
    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "Username sudah digunakan, silakan pilih username lain." }, { status: 409 });
      console.error(error);
      return NextResponse.json({ error: "Gagal membuat akun." }, { status: 500 });
    }
    setSessionCookie(makeSession(userId));
    return NextResponse.json({ user: { id: userId, username, display_name: usernameRaw, avatar_url: "/avatar.svg", created_at: new Date().toISOString() } });
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
}
