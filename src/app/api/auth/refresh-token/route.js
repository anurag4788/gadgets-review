import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import {
    generateAccessToken,
    verifyRefreshToken,
} from "@/lib/jwt";
import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";

export async function POST() {
    try {
        // Read refresh token from HttpOnly cookie
        const cookieStore = await cookies();

        const refreshToken =
            cookieStore.get("refreshToken")?.value;

        // Check if refresh token exists
        if (!refreshToken) {
            return errorResponse(
                "Refresh token not found",
                401
            );
        }

        // Verify refresh token
        const decoded =
            verifyRefreshToken(refreshToken);

        // Check if user still exists
        const user =
            await prisma.user.findUnique({
                where: {
                    id: decoded.userId,
                },
            });

        if (!user) {
            return errorResponse(
                "Unauthorized",
                401
            );
        }

        // Generate new access token
        const accessToken =
            generateAccessToken(user);

        // Return new access token
        return successResponse(
            "Access token refreshed successfully",
            {
                accessToken,
            },
            200
        );
    } catch (error) {
        console.error(
            "Refresh Token Error:",
            error
        );

        return errorResponse(
            "Invalid or expired refresh token",
            401
        );
    }
}