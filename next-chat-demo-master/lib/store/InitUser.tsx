"use client";
import React, { useEffect, useRef } from "react";
import { AppUser, useUser } from "./user";
export default function InitUser({ user }: { user: AppUser | null }) {
 const init = useRef(false); useEffect(() => { if (!init.current) useUser.setState({ user: user || undefined }); init.current = true; }, [user]); return null;
}
