import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";

/* ======================================================
   LIKE REVIEW
====================================================== */

export async function POST(
    request,
    { params }
) {
    try {

        const user =
            await authenticate(request);

        const { id } =
            await params;

        const review =
            await prisma.review.findUnique({

                where: {
                    id,
                },

                select: {
                    id: true,
                },

            });

        if (!review) {

            return errorResponse(
                "Review not found",
                404
            );

        }

        const existingLike =
            await prisma.reviewLike.findUnique({

                where: {

                    userId_reviewId: {

                        userId: user.id,
                        reviewId: id,

                    },

                },

            });

        if (existingLike) {

            return errorResponse(
                "You already liked this review.",
                409
            );

        }

        await prisma.reviewLike.create({

            data: {

                userId: user.id,
                reviewId: id,

            },

        });

        const likeCount =
            await prisma.reviewLike.count({

                where: {
                    reviewId: id,
                },

            });

        return successResponse(

            "Review liked successfully",

            {

                reviewId: id,
                likeCount,

            },

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
            "Like Review Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}

/* ======================================================
   UNLIKE REVIEW
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

        const existingLike =
            await prisma.reviewLike.findUnique({

                where: {

                    userId_reviewId: {

                        userId: user.id,
                        reviewId: id,

                    },

                },

                select: {
                    id: true,
                },

            });

        if (!existingLike) {

            return errorResponse(
                "Like not found",
                404
            );

        }

        await prisma.reviewLike.delete({

            where: {
                id: existingLike.id,
            },

        });

        const likeCount =
            await prisma.reviewLike.count({

                where: {
                    reviewId: id,
                },

            });

        return successResponse(

            "Review unliked successfully",

            {

                reviewId: id,
                likeCount,

            },

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
            "Unlike Review Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}