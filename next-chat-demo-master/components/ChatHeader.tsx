"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { AppUser, useUser } from "@/lib/store/user";
import ChatPresence from "./ChatPresence";
import { toast } from "sonner";
export default function ChatHeader({ user }: { user: AppUser | null }) {
 const router = useRouter(); const current = useUser((s) => s.user);
 const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); useUser.setState({ user: undefined }); router.refresh(); };
 return <div className="h-20"><div className="p-5 border-b flex items-center justify-between h-full"><div><h1 className="text-xl font-bold">Daily Chat</h1><ChatPresence /></div>{user || current ? <Button onClick={logout}>Logout</Button> : <Button onClick={() => toast("Gunakan form Login/Daftar di halaman ini")}>Login</Button>}</div></div>;
}
