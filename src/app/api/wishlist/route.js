import { prisma } from "@/lib/prisma";

import {
    authenticate,
} from "@/lib/auth";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";


// ==========================================
// GET MY WISHLIST
// ==========================================

export async function GET(request) {

    try {

        const user =
            await authenticate(request);


        const wishlist =
            await prisma.wishlist.findMany({

                where: {

                    userId: user.id,

                },

                orderBy: {

                    createdAt: "desc",

                },

                select: {

                    id: true,

                    createdAt: true,

                    gadget: {

                        select: {

                            id: true,

                            name: true,

                            slug: true,

                            model: true,

                            image: true,

                            releaseYear: true,

                            avgRating: true,

                            brand: {

                                select: {

                                    id: true,

                                    name: true,

                                    slug: true,

                                    logo: true,

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

            });


        return successResponse(

            "Wishlist fetched successfully",

            wishlist,

            200

        );


    } catch (error) {

        if (
            error.message === "Unauthorized"
        ) {

            return errorResponse(
                "Unauthorized",
                401
            );

        }


        console.error(
            "Get Wishlist Error:",
            error
        );


        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}


// ==========================================
// ADD TO WISHLIST
// ==========================================

export async function POST(request) {

    try {

        const user =
            await authenticate(request);


        const body =
            await request.json();


        const {
            gadgetId,
        } = body;


        // ==========================================
        // VALIDATE GADGET ID
        // ==========================================

        if (!gadgetId) {

            return errorResponse(
                "Gadget is required",
                400
            );

        }


        // ==========================================
        // CHECK GADGET
        // ==========================================

        const gadget =
            await prisma.gadget.findUnique({

                where: {

                    id: gadgetId,

                },

                select: {

                    id: true,

                },

            });


        if (!gadget) {

            return errorResponse(
                "Gadget not found",
                404
            );

        }


        // ==========================================
        // CHECK EXISTING WISHLIST
        // ==========================================

        const existingWishlist =
            await prisma.wishlist.findUnique({

                where: {

                    userId_gadgetId: {

                        userId: user.id,

                        gadgetId,

                    },

                },

            });


        if (existingWishlist) {

            return errorResponse(
                "Gadget is already in your wishlist",
                409
            );

        }


        // ==========================================
        // CREATE WISHLIST
        // ==========================================

        const wishlist =
            await prisma.wishlist.create({

                data: {

                    userId: user.id,

                    gadgetId,

                },

                select: {

                    id: true,

                    createdAt: true,

                    gadget: {

                        select: {

                            id: true,

                            name: true,

                            slug: true,

                        },

                    },

                },

            });


        return successResponse(

            "Gadget added to wishlist",

            wishlist,

            201

        );


    } catch (error) {

        if (
            error.message === "Unauthorized"
        ) {

            return errorResponse(
                "Unauthorized",
                401
            );

        }


        console.error(
            "Add Wishlist Error:",
            error
        );


        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}