import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/jwt";


// ==========================================
// AUTHENTICATE USER
// ==========================================

export async function authenticate(request) {

    // ==========================================
    // READ AUTHORIZATION HEADER
    // ==========================================

    const authHeader =
        request.headers.get(
            "Authorization"
        );


    // ==========================================
    // CHECK HEADER
    // ==========================================

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {

        throw new Error(
            "Unauthorized"
        );

    }


    // ==========================================
    // EXTRACT TOKEN
    // ==========================================

    const token =
        authHeader.split(" ")[1];


    // ==========================================
    // VERIFY TOKEN
    // ==========================================

    let decoded;

    try {

        decoded =
            verifyAccessToken(token);

    } catch (error) {

        if (
            error.name ===
                "TokenExpiredError" ||

            error.name ===
                "JsonWebTokenError"
        ) {

            throw new Error(
                "Unauthorized"
            );

        }

        throw error;

    }


    // ==========================================
    // FIND USER
    // ==========================================

    const user =
        await prisma.user.findUnique({

            where: {
                id: decoded.userId,
            },

        });


    // ==========================================
    // USER NOT FOUND
    // ==========================================

    if (!user) {

        throw new Error(
            "Unauthorized"
        );

    }


    return user;

}


// ==========================================
// ADMIN AUTHORIZATION
// ==========================================

export function requireAdmin(user) {

    if (
        user.role !== "ADMIN"
    ) {

        throw new Error(
            "Forbidden"
        );

    }

}