import { loginSchema } from "@/validations/authValidations";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        // Read request body
        const body = await request.json();

        // Validate request
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return errorResponse(
                result.error.issues[0].message,
                400
            );
        }

        const { email, password } = result.data;

        // Find user
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return errorResponse(
                "Invalid email or password",
                401
            );
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return errorResponse(
                "Invalid email or password",
                401
            );
        }

        // Generate JWTs
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token in HttpOnly cookie
        const cookieStore = await cookies();

        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge:
                Number(process.env.REFRESH_COOKIE_MAX_AGE) ||
                7 * 24 * 60 * 60,
            path: "/",
        });

        // Return response
        return successResponse(
            "Login successful",
            {
                accessToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            200
        );
    } catch (error) {
        console.error("Login Error:", error);

        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}