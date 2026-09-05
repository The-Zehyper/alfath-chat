import crypto from "crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase/admin";

export type AppUser = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
};

const COOKIE = "daily_chat_session";
const SESSION_DAYS = 30;

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function validUsername(value: string) {
  return /^[a-zA-Z0-9_]{3,24}$/.test(value);
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

function sign(value: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function makeSession(userId: string) {
  const payload = `${userId}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function parseSession(value?: string | null) {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [userId, timestamp, signature] = parts;
  const payload = `${userId}.${timestamp}`;
  if (!userId || !/^\d+$/.test(timestamp)) return null;
  const age = Date.now() - Number(timestamp);
  if (age < 0 || age > SESSION_DAYS * 86400000) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return userId;
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const value = cookies().get(COOKIE)?.value;
  const userId = parseSession(value);
  if (!userId) return null;
  const { data } = await supabaseAdmin().from("users").select("id,username,display_name,avatar_url,created_at").eq("id", userId).maybeSingle();
  return data as AppUser | null;
}

export function setSessionCookie(value: string) {
  cookies().set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}

export { COOKIE };
