import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "mirmalek_session";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET || "mirmalek-fallback-dev-secret";
  return new TextEncoder().encode(secret);
}

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/health"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, getSecretKey());
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
