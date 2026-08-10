import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";
import { createReviewSchema } from "@/validations/reviewValidations";
import { updateAverageRating } from "@/lib/review";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";


// ==========================================
// GET REVIEWS
// ==========================================

// ==========================================
// GET REVIEWS
// ==========================================

export async function GET(request) {

    try {

        const { searchParams } =
            new URL(request.url);

        const gadgetId =
            searchParams.get("gadgetId");

        const page =
            Math.max(
                Number(searchParams.get("page")) || 1,
                1
            );

        const limit =
            Math.min(
                Math.max(
                    Number(searchParams.get("limit")) || 10,
                    1
                ),
                50
            );

        const skip =
            (page - 1) * limit;


        // ==========================================
        // OPTIONAL AUTHENTICATION
        // ==========================================

        let currentUser = null;

        try {

            const authHeader =
                request.headers.get(
                    "Authorization"
                );

            if (
                authHeader &&
                authHeader.startsWith("Bearer ")
            ) {

                currentUser =
                    await authenticate(request);

            }

        } catch (error) {

            // GET reviews is public.
            // Invalid/missing authentication
            // should NOT prevent viewing reviews.

            currentUser = null;

        }


        // ==========================================
        // BUILD FILTER
        // ==========================================

        const where = {};

        if (gadgetId) {

            where.gadgetId =
                gadgetId;

        }


        // ==========================================
        // FETCH REVIEWS + TOTAL
        // ==========================================

        const [
            reviews,
            total,
        ] = await prisma.$transaction([

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
        // ADD isLiked
        // ==========================================

        let reviewsWithLikeStatus =
            reviews;


        if (currentUser) {

            const reviewIds =
                reviews.map(
                    (review) => review.id
                );

            const userLikes =
                await prisma.reviewLike.findMany({

                    where: {

                        userId:
                            currentUser.id,

                        reviewId: {

                            in: reviewIds,

                        },

                    },

                    select: {

                        reviewId: true,

                    },

                });


            const likedReviewIds =
                new Set(
                    userLikes.map(
                        (like) =>
                            like.reviewId
                    )
                );


            reviewsWithLikeStatus =
                reviews.map(
                    (review) => ({

                        ...review,

                        isLiked:
                            likedReviewIds.has(
                                review.id
                            ),

                    })
                );

        } else {

            reviewsWithLikeStatus =
                reviews.map(
                    (review) => ({

                        ...review,

                        isLiked: false,

                    })
                );

        }


        // ==========================================
        // PAGINATION
        // ==========================================

        const totalPages =
            Math.ceil(
                total / limit
            );


        return successResponse(

            "Reviews fetched successfully",

            {

                reviews:
                    reviewsWithLikeStatus,

                pagination: {

                    total,

                    page,

                    limit,

                    totalPages,

                    hasNextPage:
                        page < totalPages,

                    hasPreviousPage:
                        page > 1,

                },

            }

        );

    } catch (error) {

        console.error(
            "Get Reviews Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}


// ==========================================
// CREATE REVIEW
// ==========================================

export async function POST(request) {

    try {

        // Authenticate User

        const user =
            await authenticate(request);


        // Read Body

        const body =
            await request.json();


        // Validate Body

        const parsed =
            createReviewSchema.safeParse(
                body
            );


        if (!parsed.success) {

            return errorResponse(
                "Validation Failed",
                400,
                parsed.error.flatten()
            );

        }


        const {
            title,
            review,
            rating,
            gadgetId,
        } = parsed.data;


        // Check Gadget

        const gadget =
            await prisma.gadget.findUnique({

                where: {
                    id: gadgetId,
                },

            });


        if (!gadget) {

            return errorResponse(
                "Gadget not found",
                404
            );

        }


        // Check Existing Review

        const existingReview =
            await prisma.review.findUnique({

                where: {

                    userId_gadgetId: {

                        userId: user.id,

                        gadgetId,

                    },

                },

            });


        if (existingReview) {

            return errorResponse(
                "You have already reviewed this gadget.",
                409
            );

        }


        // Create Review

        const createdReview =
            await prisma.$transaction(

                async (tx) => {

                    const createdReview =
                        await tx.review.create({

                            data: {

                                title,

                                review,

                                rating,

                                userId:
                                    user.id,

                                gadgetId,

                            },

                            select: {

                                id: true,

                                title: true,

                                review: true,

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

                                    },

                                },

                            },

                        });


                    return createdReview;

                }

            );


        // Update Average Rating

        await updateAverageRating(
            gadgetId
        );


        return successResponse(

            "Review created successfully",

            createdReview,

            201

        );

    } catch (error) {

        if (
            error.message ===
            "Unauthorized"
        ) {

            return errorResponse(
                "Unauthorized",
                401
            );

        }


        console.error(
            "Create Review Error:",
            error
        );


        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}