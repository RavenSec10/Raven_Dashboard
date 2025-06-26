import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuth = !!req.nextauth.token;

    if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();
    if (!isAuth) return NextResponse.redirect(new URL("/sign-in", req.url));

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/auth/register") ||
          PUBLIC_ROUTES.includes(pathname)
        ) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|api/auth/register|_next/static|_next/image|favicon.ico|sign-in|sign-up|.*\\.(?:svg|png|jpg|jpeg|webp|ico|txt|js|css|woff|woff2|ttf)$).*)",
  ],
};