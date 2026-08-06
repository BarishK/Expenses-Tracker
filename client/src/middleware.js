import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // Eğer token yoksa ve kullanıcı korunmalı bir sayfaya girmeye çalışıyorsa login'e at
  // Korunmalı sayfalar: Ana sayfa (/), /transactions ve /settings
  if (
    !token &&
    (pathname === "/" ||
      pathname.startsWith("/transactions") ||
      pathname.startsWith("/settings"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Eğer token varsa ve kullanıcı login/register'a girmeye çalışıyorsa ana sayfaya at
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Buraya korumak istediğin tüm yolları ekle
  matcher: [
    "/",
    "/transactions/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
