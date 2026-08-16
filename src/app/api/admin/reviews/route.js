import { prisma } from "@/lib/prisma";

import {
    authenticate,
    requireAdmin,
} from "@/lib/auth";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";


// ==========================================
// GET ALL REVIEWS - ADMIN
// ==========================================

export async function GET(request) {

    try {

        // ==========================================
        // AUTHENTICATION
        // ==========================================

        const user =
            await authenticate(request);


        // ==========================================
        // ADMIN AUTHORIZATION
        // ==========================================

        requireAdmin(user);


        // ==========================================
        // QUERY PARAMETERS
        // ==========================================

        const { searchParams } =
            new URL(request.url);


        const page =
            Math.max(
                Number(searchParams.get("page")) || 1,
                1
            );


        const limit =
            Math.min(
                Math.max(
                    Number(
                        searchParams.get("limit")
                    ) || 10,
                    1
                ),
                50
            );


        const search =
            searchParams
                .get("search")
                ?.trim() || "";


        const ratingParam =
            searchParams.get("rating");


        const rating =
            ratingParam
                ? Number(ratingParam)
                : null;


        const skip =
            (page - 1) * limit;


        // ==========================================
        // WHERE CONDITION
        // ==========================================

        const where = {

            ...(search && {

                OR: [

                    {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },

                    {
                        review: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },

                    {
                        user: {

                            name: {
                                contains: search,
                                mode: "insensitive",
                            },

                        },
                    },

                    {
                        user: {

                            email: {
                                contains: search,
                                mode: "insensitive",
                            },

                        },
                    },

                    {
                        gadget: {

                            name: {
                                contains: search,
                                mode: "insensitive",
                            },

                        },
                    },

                ],

            }),

            ...(rating &&
                rating >= 1 &&
                rating <= 5 && {

                    rating,

                }),

        };


        // ==========================================
        // FETCH REVIEWS + TOTAL COUNT
        // ==========================================

        const [
            reviews,
            totalReviews,
        ] = await Promise.all([

            prisma.review.findMany({

                where,

                skip,
                take: limit,

                orderBy: {

                    createdAt: "desc",

                },

                select: {

                    id: true,

                    title: true,

                    review: true,

                    rating: true,

                    createdAt: true,

                    updatedAt: true,


                    user: {

                        select: {

                            id: true,

                            name: true,

                            email: true,

                        },

                    },


                    gadget: {

                        select: {

                            id: true,

                            name: true,

                            slug: true,

                            image: true,

                        },

                    },


                    _count: {

                        select: {

                            likes: true,

                        },

                    },

                },

            }),


            prisma.review.count({

                where,

            }),

        ]);


        // ==========================================
        // PAGINATION
        // ==========================================

        const totalPages =
            Math.ceil(
                totalReviews / limit
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return successResponse(

            "Reviews fetched successfully",

            {

                reviews,

                pagination: {

                    currentPage: page,

                    limit,

                    totalReviews,

                    totalPages,

                    hasNextPage:
                        page < totalPages,

                    hasPreviousPage:
                        page > 1,

                },

            },

            200

        );


    } catch (error) {


        // ==========================================
        // AUTHORIZATION ERRORS
        // ==========================================

        if (
            error.message === "Unauthorized"
        ) {

            return errorResponse(
                "Unauthorized",
                401
            );

        }


        if (
            error.message === "Forbidden"
        ) {

            return errorResponse(
                "Forbidden",
                403
            );

        }


        // ==========================================
        // SERVER ERROR
        // ==========================================

        console.error(
            "Admin Reviews Error:",
            error
        );


        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}