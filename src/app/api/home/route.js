import { prisma } from "@/lib/prisma";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";

export async function GET() {

    try {

        const [

            latestGadgets,

            topRatedGadgets,

            featuredBrands,

            categories,

            latestReviews,

        ] = await Promise.all([

            // -------------------------
            // Latest Gadgets
            // -------------------------

            prisma.gadget.findMany({

                take: 8,

                orderBy: {
                    createdAt: "desc",
                },

                select: {

                    id: true,

                    name: true,

                    slug: true,

                    image: true,

                    avgRating: true,

                    releaseYear: true,

                    brand: {

                        select: {

                            id: true,

                            name: true,

                            slug: true,

                        },

                    },

                },

            }),

            // -------------------------
            // Top Rated Gadgets
            // -------------------------

            prisma.gadget.findMany({

                take: 8,

                where: {

                    avgRating: {

                        gt: 0,

                    },

                },

                orderBy: {

                    avgRating: "desc",

                },

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

                },

            }),

            // -------------------------
            // Featured Brands
            // -------------------------

            prisma.brand.findMany({

                where: {

                    isActive: true,

                },

                take: 8,

                orderBy: {

                    name: "asc",

                },

                select: {

                    id: true,

                    name: true,

                    slug: true,

                    logo: true,

                },

            }),

            // -------------------------
            // Categories
            // -------------------------

            prisma.category.findMany({

                orderBy: {

                    name: "asc",

                },

                select: {

                    id: true,

                    name: true,

                    slug: true,

                },

            }),

            // -------------------------
            // Latest Reviews
            // -------------------------

            prisma.review.findMany({

                take: 6,

                orderBy: {

                    createdAt: "desc",

                },

                select: {

                    id: true,

                    title: true,

                    rating: true,

                    createdAt: true,

                    user: {

                        select: {

                            id: true,

                            name: true,

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

                },

            }),

        ]);

        return successResponse(

            "Home data fetched successfully",

            {

                latestGadgets,

                topRatedGadgets,

                featuredBrands,

                categories,

                latestReviews,

            }

        );

    } catch (error) {

        console.error(
            "Home API Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}