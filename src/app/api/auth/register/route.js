import { registerSchema } from "@/validations/authValidations";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        // Read request body
        const body = await request.json();

        // Validate request
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return errorResponse(
                result.error.issues[0].message,
                400
            );
        }

        const { name, email, password } = result.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return errorResponse(
                "Email already exists",
                409
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            Number(process.env.BCRYPT_SALT_ROUNDS) || 10
        );

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return successResponse(
            "User registered successfully",
            user,
            201
        );
    } catch (error) {
        console.error("Register Error:", error);

        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}