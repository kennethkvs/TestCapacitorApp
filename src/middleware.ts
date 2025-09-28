import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    // Protect admin route
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      request.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  // TODO Add matchers to protected routes
  matcher: ["/admin"],
};
