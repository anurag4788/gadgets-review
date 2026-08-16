import { prisma } from "@/lib/prisma";

import {
    authenticate,
    requireAdmin,
} from "@/lib/auth";

import { updateAverageRating } from "@/lib/review";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";


// ==========================================
// DELETE REVIEW - ADMIN
// ==========================================

export async function DELETE(
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
        // GET REVIEW ID
        // ==========================================

        const { id } =
            await params;


        // ==========================================
        // FIND REVIEW
        // ==========================================

        const review =
            await prisma.review.findUnique({

                where: {
                    id,
                },

                select: {

                    id: true,
                    gadgetId: true,

                },

            });


        // ==========================================
        // REVIEW NOT FOUND
        // ==========================================

        if (!review) {

            return errorResponse(
                "Review not found",
                404
            );

        }


        // ==========================================
        // DELETE REVIEW
        // ==========================================

        await prisma.review.delete({

            where: {
                id,
            },

        });


        // ==========================================
        // UPDATE GADGET RATING
        // ==========================================

        await updateAverageRating(
            review.gadgetId
        );


        // ==========================================
        // RESPONSE
        // ==========================================

        return successResponse(

            "Review deleted successfully",

            null,

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
            "Admin Delete Review Error:",
            error
        );


        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}