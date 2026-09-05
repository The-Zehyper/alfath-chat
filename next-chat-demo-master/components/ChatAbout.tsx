"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/store/user";
export default function ChatAbout() {
 const [mode,setMode]=useState<"login"|"register">("login"); const [username,setUsername]=useState(""); const [password,setPassword]=useState(""); const [loading,setLoading]=useState(false); const [available,setAvailable]=useState<boolean|null>(null); const router=useRouter();
 const check=async(v:string)=>{setUsername(v); if(mode!=="register"||v.length<3){setAvailable(null);return;} const r=await fetch("/api/auth/check-username",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:v})}); const d=await r.json(); setAvailable(d.valid?d.available:null);};
 const submit=async()=>{setLoading(true); try {const r=await fetch(mode==="register"?"/api/auth/register":"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})}); const d=await r.json(); if(!r.ok){toast.error(d.error||"Gagal");return;} useUser.setState({user:d.user}); router.refresh();} finally {setLoading(false);} };
 return <div className="flex-1 flex items-center justify-center p-5"><div className="w-full max-w-sm space-y-5"><div className="text-center"><h1 className="text-3xl font-bold">Welcome to Daily Chat</h1><p className="text-gray-400 mt-2">Chat realtime tanpa email dan tanpa OAuth.</p></div><div className="border rounded-lg p-5 space-y-4"><div className="flex gap-2"><Button className="flex-1" variant={mode==="login"?"default":"outline"} onClick={()=>{setMode("login");setAvailable(null)}}>Login</Button><Button className="flex-1" variant={mode==="register"?"default":"outline"} onClick={()=>setMode("register")}>Daftar</Button></div><div className="space-y-2"><Label>Nama pengguna</Label><Input value={username} onChange={e=>mode==="register"?check(e.target.value):setUsername(e.target.value)} placeholder="username" autoComplete="username" />{mode==="register"&&available!==null&&<p className={available?"text-sm text-green-500":"text-sm text-red-500"}>{available?"Username tersedia":"Username sudah digunakan, silakan pilih username lain."}</p>}</div><div className="space-y-2"><Label>Password</Label><Input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" autoComplete={mode==="login"?"current-password":"new-password"} /></div><Button className="w-full" disabled={loading} onClick={submit}>{loading?"Memproses...":mode==="login"?"Login":"Daftar"}</Button></div></div></div>;
}
