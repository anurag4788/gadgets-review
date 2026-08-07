import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";
import { reviewSchema } from "@/validations/reviewValidations";
import { updateAverageRating } from "@/lib/review";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";

/* ======================================================
   GET SINGLE REVIEW
====================================================== */

export async function GET(
    request,
    { params }
) {
    try {
        const { id } =
            await params;

        const review =
            await prisma.review.findUnique({
                where: {
                    id,
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
                        },
                    },
                    gadget: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            avgRating: true,
                        },
                    },
                },
            });

        if (!review) {
            return errorResponse(
                "Review not found",
                404
            );
        }
        return successResponse(
            "Review fetched successfully",
            review,
            200
        );
    } catch (error) {
        console.error(
            "Get Review Error:",
            error
        );
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}

/* ======================================================
   UPDATE REVIEW
====================================================== */

export async function PUT(
    request,
    { params }
) {
    try {
        const user =
            await authenticate(request);

        const { id } =
            await params;

        const body =
            await request.json();

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
        } = parsed.data;

        const existingReview =
            await prisma.review.findUnique({
                where: {
                    id,
                },
            });

        if (!existingReview) {
            return errorResponse(
                "Review not found",
                404
            );
        }
        if (
            existingReview.userId !==
            user.id
        ) {
            return errorResponse(
                "You can only update your own review.",
                403
            );
        }
                const updatedReview =
            await prisma.review.update({
                where: {
                    id,
                },
                data: {
                    title,
                    review,
                    rating,
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

        await updateAverageRating(
            existingReview.gadgetId
        );
        return successResponse(
            "Review updated successfully",
            updatedReview,
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
            "Update Review Error:",
            error
        );
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}

/* ======================================================
   DELETE REVIEW
====================================================== */

export async function DELETE(
    request,
    { params }
) {
    try {
        const user =
            await authenticate(request);

        const { id } =
            await params;

        const existingReview =
            await prisma.review.findUnique({
                where: {
                    id,
                },
                select: {
                    id: true,
                    userId: true,
                    gadgetId: true,
                },
            });
        if (!existingReview) {
            return errorResponse(
                "Review not found",
                404
            );
        }
        if (
            existingReview.userId !==
            user.id
        ) {
            return errorResponse(
                "You can only delete your own review.",
                403
            );
        }
        await prisma.review.delete({

            where: {
                id,
            },

        });
        await updateAverageRating(
            existingReview.gadgetId
        );
        return successResponse(
            "Review deleted successfully",
            null,
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
            "Delete Review Error:",
            error
        );
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}