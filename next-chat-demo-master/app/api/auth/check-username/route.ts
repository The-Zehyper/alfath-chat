import { NextResponse } from "next/server";
import { normalizeUsername, validUsername } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { username } = await request.json();
  const normalized = normalizeUsername(String(username || ""));
  if (!validUsername(normalized)) return NextResponse.json({ available: false, valid: false });
  const { data } = await supabaseAdmin().from("users").select("id").eq("username", normalized).maybeSingle();
  return NextResponse.json({ available: !data, valid: true });
}
