import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

import { updateUserSchema } from "@/validations/userValidations";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";


// ==========================================
// GET CURRENT USER
// ==========================================

export async function GET(request) {
    try {

        const user =
            await authenticate(request);

        const currentUser =
            await prisma.user.findUnique({

                where: {
                    id: user.id,
                },

                select: {

                    id: true,
                    name: true,
                    email: true,
                    role: true,

                    createdAt: true,
                    updatedAt: true,

                    _count: {

                        select: {

                            reviews: true,
                            likes: true,

                        },

                    },

                },

            });

        if (!currentUser) {

            return errorResponse(
                "User not found",
                404
            );

        }

        return successResponse(
            "User fetched successfully",
            currentUser,
            200
        );

    } catch (error) {

        if (
            error.message === "Unauthorized" ||
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError"
        ) {

            return errorResponse(
                "Unauthorized",
                401
            );

        }

        console.error(
            "Get Current User Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );

    }
}


// ==========================================
// UPDATE CURRENT USER
// ==========================================

export async function PUT(request) {

    try {

        // ==========================================
        // AUTHENTICATION
        // ==========================================

        const user =
            await authenticate(request);


        // ==========================================
        // READ REQUEST BODY
        // ==========================================

        const body =
            await request.json();


        // ==========================================
        // VALIDATION
        // ==========================================

        const result =
            updateUserSchema.safeParse(body);

        if (!result.success) {

            return errorResponse(
                result.error.issues[0].message,
                400
            );

        }


        const {
            name,
            email,
        } = result.data;


        // ==========================================
        // CHECK EMAIL DUPLICATE
        // ==========================================

        const existingUser =
            await prisma.user.findFirst({

                where: {

                    email,

                    id: {
                        not: user.id,
                    },

                },

                select: {
                    id: true,
                },

            });


        if (existingUser) {

            return errorResponse(
                "Email is already in use.",
                409
            );

        }


        // ==========================================
        // UPDATE USER
        // ==========================================

        const updatedUser =
            await prisma.user.update({

                where: {
                    id: user.id,
                },

                data: {

                    name,
                    email,

                },

                select: {

                    id: true,
                    name: true,
                    email: true,
                    role: true,

                    createdAt: true,
                    updatedAt: true,

                    _count: {

                        select: {

                            reviews: true,
                            likes: true,

                        },

                    },

                },

            });


        // ==========================================
        // RESPONSE
        // ==========================================

        return successResponse(
            "Profile updated successfully",
            updatedUser,
            200
        );

    } catch (error) {

        if (
            error.message === "Unauthorized" ||
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError"
        ) {

            return errorResponse(
                "Unauthorized",
                401
            );

        }

        console.error(
            "Update User Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}