import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/jwt";

// export async function authenticate(request) {
//     // Read Authorization header
//     const authHeader =
//         request.headers.get("Authorization");

//     // Check header
//     if (
//         !authHeader ||
//         !authHeader.startsWith("Bearer ")
//     ) {
//         throw new Error("Unauthorized");
//     }

//     // Extract token
//     const token =
//         authHeader.split(" ")[1];

//     // Verify token
//     const decoded =
//         verifyAccessToken(token);

//     // Find user
//     const user =
//         await prisma.user.findUnique({
//             where: {
//                 id: decoded.userId,
//             },
//         });

//     // User not found
//     if (!user) {
//         throw new Error("Unauthorized");
//     }

//     return user;
// }
export async function authenticate(request) {

    // Read Authorization header

    const authHeader =
        request.headers.get("Authorization");


    // Check header

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {

        throw new Error("Unauthorized");

    }


    // Extract token

    const token =
        authHeader.split(" ")[1];


    let decoded;

    try {

        decoded =
            verifyAccessToken(token);

    } catch (error) {

        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError"
        ) {

            throw new Error("Unauthorized");

        }

        throw error;

    }


    // Find user

    const user =
        await prisma.user.findUnique({

            where: {
                id: decoded.userId,
            },

        });


    // User not found

    if (!user) {

        throw new Error("Unauthorized");

    }


    return user;

}
export function requireAdmin(user) {
    if (user.role !== "ADMIN") {
        throw new Error("Forbidden");
    }
}