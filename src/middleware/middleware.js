import { NextResponse } from "next/server";

// ==========================================
// PROTECTED ROUTES
// ==========================================
// Add any route prefixes here that should require login.

const protectedPrefixes = ["/admin"];


export function middleware(request) {

    const { pathname } = request.nextUrl;

    const isProtected = protectedPrefixes.some(
        (prefix) => pathname.startsWith(prefix)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    // ==========================================
    // READ TOKEN FROM COOKIE
    // ==========================================
    // This cookie is set in lib/authClient.js's saveToken() —
    // middleware cannot read localStorage, so this mirrors it.

    const token = request.cookies.get("accessToken")?.value;

    if (!token) {

        const loginUrl = new URL("/login", request.url);

        // send the user back to where they were trying to go
        loginUrl.searchParams.set("redirect", pathname);

        return NextResponse.redirect(loginUrl);

    }

    // ==========================================
    // OPTIONAL: ROLE CHECK
    // ==========================================
    // If your login also sets a "role" cookie, uncomment this
    // to block non-admins from /admin even if they're logged in.

    // const role = request.cookies.get("role")?.value;
    //
    // if (role !== "admin") {
    //     return NextResponse.redirect(new URL("/", request.url));
    // }

    return NextResponse.next();

}


// ==========================================
// MATCHER
// ==========================================
// Only run this middleware for routes under /admin.

export const config = {
    matcher: ["/admin/:path*"],
};