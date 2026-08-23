import { NextResponse } from "next/server";


// ==========================================
// PROTECTED ROUTES
// ==========================================

const protectedPrefixes = [
    "/admin",
];


// ==========================================
// MIDDLEWARE
// ==========================================

export function middleware(request) {

    const {
        pathname,
    } = request.nextUrl;


    // ==========================================
    // CHECK PROTECTED ROUTE
    // ==========================================

    const isProtected =
        protectedPrefixes.some(
            (prefix) =>
                pathname.startsWith(prefix)
        );


    // Public route
    if (!isProtected) {

        return NextResponse.next();

    }


    // ==========================================
    // READ ACCESS TOKEN COOKIE
    // ==========================================

    const token =
        request.cookies.get(
            "accessToken"
        )?.value;


    // ==========================================
    // TOKEN NOT FOUND
    // ==========================================

    if (!token) {

        const loginUrl =
            new URL(
                "/login",
                request.url
            );


        loginUrl.searchParams.set(
            "redirect",
            pathname
        );


        return NextResponse.redirect(
            loginUrl
        );

    }


    // ==========================================
    // ALLOW REQUEST
    // ==========================================

    return NextResponse.next();

}


// ==========================================
// MATCHER
// ==========================================

export const config = {

    matcher: [
        "/admin/:path*",
    ],

};