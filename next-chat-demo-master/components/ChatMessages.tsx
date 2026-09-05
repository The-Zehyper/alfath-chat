import React, { Suspense } from "react";
import ListMessages from "./ListMessages";
import { supabaseBrowser } from "@/lib/supabase/browser";
import InitMessages from "@/lib/store/InitMessages";
import { LIMIT_MESSAGE } from "@/lib/constant";
export default async function ChatMessages() {
 const supabase = supabaseBrowser();
 const { data } = await supabase.from("messages").select("*,users(id,username,display_name,avatar_url,created_at)").range(0, LIMIT_MESSAGE).order("created_at", { ascending: false });
 return <Suspense fallback={"loading.."}><ListMessages /><InitMessages messages={data?.reverse() || []} /></Suspense>;
}
