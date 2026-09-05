import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
export async function POST(request: Request) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "Belum login." }, { status: 401 });
  const { id, text } = await request.json(); const clean = String(text || "").trim(); if (!clean) return NextResponse.json({ error: "Message can not be empty!!" }, { status: 400 });
  const { error } = await supabaseAdmin().from("messages").update({ text: clean, is_edit: true }).eq("id", id).eq("send_by", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 }); return NextResponse.json({ ok: true });
}
