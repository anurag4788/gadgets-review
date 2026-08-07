import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";
import { reviewSchema } from "@/validations/reviewValidations";
import { updateAverageRating } from "@/lib/review";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";

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
            reviewSchema.safeParse(body);

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
                // Create Review + Update Rating

        const createdReview =
            await prisma.$transaction(
                async (tx) => {

                    const createdReview  =
                        await tx.review.create({

                            data: {

                                title,
                                review,
                                rating,
                                userId: user.id,
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

                    return createdReview ;

                }
            );

        // Update Gadget Average Rating

        await updateAverageRating(gadgetId);

        return successResponse(
            "Review created successfully",
            createdReview,
            201
        );

    } catch (error) {

        if (error.message === "Unauthorized") {

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