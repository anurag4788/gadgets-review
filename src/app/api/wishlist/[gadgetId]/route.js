import { prisma } from "@/lib/prisma";

import {
    authenticate,
} from "@/lib/auth";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";


// ==========================================
// REMOVE FROM WISHLIST
// ==========================================

export async function DELETE(
    request,
    { params }
) {

    try {

        const user =
            await authenticate(request);


        const { gadgetId } =
            await params;


        // ==========================================
        // FIND WISHLIST ITEM
        // ==========================================

        const wishlist =
            await prisma.wishlist.findUnique({

                where: {

                    userId_gadgetId: {

                        userId: user.id,

                        gadgetId,

                    },

                },

                select: {

                    id: true,

                },

            });


        // ==========================================
        // NOT FOUND
        // ==========================================

        if (!wishlist) {

            return errorResponse(
                "Gadget is not in your wishlist",
                404
            );

        }


        // ==========================================
        // DELETE
        // ==========================================

        await prisma.wishlist.delete({

            where: {

                id: wishlist.id,

            },

        });


        return successResponse(

            "Gadget removed from wishlist",

            null,

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
            "Remove Wishlist Error:",
            error
        );


        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}