import { auth } from "./auth"
import { NextResponse } from "next/server"

// Define public routes
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export default auth((req) => {
    const path = req.nextUrl.pathname;

    // Check if the path is public
    if (publicRoutes.includes(path)) {
        return NextResponse.next();
    }

    // Protected paths
    if (!req.auth) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Admin only paths
    if (path.startsWith("/admin")) {
        const isAdmin = req.auth.user?.roles?.some(
            role => role === "sysAdmin" || role === "administrator"
        );

        if (!isAdmin) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    return NextResponse.next();
})

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
} 