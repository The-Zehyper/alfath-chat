import React from "react";
import ChatHeader from "@/components/ChatHeader";
import InitUser from "@/lib/store/InitUser";
import ChatInput from "@/components/ChatInput";
import ListMessages from "@/components/ListMessages";
import ChatMessages from "@/components/ChatMessages";
import ChatAbout from "@/components/ChatAbout";
import { getCurrentUser } from "@/lib/auth";
export default async function Page() {
 const user = await getCurrentUser();
 return <><div className="max-w-3xl mx-auto md:py-10 h-screen"><div className="h-full border rounded-md flex flex-col relative"><ChatHeader user={user} />{user ? <><ChatMessages /><ChatInput /></> : <ChatAbout />}</div></div><InitUser user={user} /></>;
}
