import { NextResponse } from "next/server";

export function proxy(request) {
  // .value ekleyerek string değerini alıyoruz
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Token yoksa ve korunan sayfaya girilmek isteniyorsa login'e yönlendir
  if (
    !token &&
    (pathname === "/" ||
      pathname.startsWith("/transactions") ||
      pathname.startsWith("/settings"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Token varsa ve auth sayfalarına girilmek isteniyorsa ana sayfaya yönlendir
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/transactions/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
