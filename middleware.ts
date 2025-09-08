// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // ✅ Only allow sign-in and sign-up pages to be public
  publicRoutes: ["/sign-in", "/sign-up"],
});

export const config = {
  matcher: [
    // ✅ protect everything except static assets and explicitly public APIs
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/public).*)",
  ],
};