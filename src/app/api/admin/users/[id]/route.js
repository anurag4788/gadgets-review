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
// GET USER DETAILS
// ==========================================

export async function GET(
    request,
    { params }
) {

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
        // GET USER ID
        // ==========================================

        const { id } =
            await params;


        // ==========================================
        // FETCH USER
        // ==========================================

        const targetUser =
            await prisma.user.findUnique({

                where: {
                    id,
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

                    reviews: {

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

                            _count: {

                                select: {

                                    likes: true,

                                },

                            },

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

                        },

                    },

                },

            });


        // ==========================================
        // USER NOT FOUND
        // ==========================================

        if (!targetUser) {

            return errorResponse(
                "User not found",
                404
            );

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return successResponse(

            "User details fetched successfully",

            targetUser,

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
            "Get Admin User Details Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}