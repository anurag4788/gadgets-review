import { prisma } from "@/lib/prisma";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";

export async function GET(
    request,
    { params }
) {
    try {

        const { id } =
            await params;

        const user =
            await prisma.user.findUnique({

                where: {
                    id,
                },

                select: {

                    id: true,

                    name: true,

                    role: true,

                    createdAt: true,

                    _count: {

                        select: {

                            reviews: true,

                            likes: true,

                        },

                    },

                },

            });

        if (!user) {

            return errorResponse(
                "User not found",
                404
            );

        }

        return successResponse(

            "User fetched successfully",

            {

                id: user.id,

                name: user.name,

                role: user.role,

                createdAt: user.createdAt,

                reviewCount:
                    user._count.reviews,

                likeCount:
                    user._count.likes,

            }

        );

    } catch (error) {

        console.error(
            "Get User Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}