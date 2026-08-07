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

        const { id } = await params;

        const user =
            await prisma.user.findUnique({

                where: {
                    id,
                },

                select: {
                    id: true,
                },

            });

        if (!user) {

            return errorResponse(
                "User not found",
                404
            );

        }

        const reviews =
            await prisma.review.findMany({

                where: {
                    userId: id,
                },

                include: {

                    gadget: {

                        select: {

                            id: true,

                            name: true,

                            slug: true,

                            image: true,

                            avgRating: true,

                            brand: {

                                select: {

                                    id: true,

                                    name: true,

                                    slug: true,

                                },

                            },

                            category: {

                                select: {

                                    id: true,

                                    name: true,

                                    slug: true,

                                },

                            },

                        },

                    },

                    _count: {

                        select: {

                            likes: true,

                        },

                    },

                },

                orderBy: {

                    createdAt: "desc",

                },

            });

        return successResponse(

            "User reviews fetched successfully",

            reviews

        );

    } catch (error) {

        console.error(
            "Get User Reviews Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}