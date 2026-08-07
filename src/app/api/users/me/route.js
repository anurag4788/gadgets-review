import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";

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

        return successResponse(
            "User fetched successfully",
            currentUser,
            200
        );

    } catch (error) {

        if (error.message === "Unauthorized") {

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