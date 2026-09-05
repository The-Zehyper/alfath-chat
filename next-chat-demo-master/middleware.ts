import { NextResponse, type NextRequest } from "next/server";

// Custom username/password sessions use an HttpOnly cookie. No Supabase Auth
// session or OAuth callback is needed here.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
