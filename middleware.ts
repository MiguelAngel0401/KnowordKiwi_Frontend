import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Especifica las rutas que quieres proteger
export const config = {
  matcher: ["/profile/:path*", "/communities/:path*", "/posts/:path*"],
};

export function middleware(request: NextRequest) {
  // 2. Extrae el token de ACCESO de las cookies
  const accessToken = request.cookies.get("access-token")?.value;

  // 3. Redirige al login si no hay token
  if (!accessToken) {
    // Guarda la URL a la que intentaba acceder para redirigirlo después del login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    loginUrl.searchParams.set("reason", "unauthorized");

    return NextResponse.redirect(loginUrl);
  }

  // 4. Si hay token, permite el acceso
  return NextResponse.next();
}
