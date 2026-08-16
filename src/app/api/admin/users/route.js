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
// GET ALL USERS
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
        // URL PARAMETERS
        // ==========================================

        const { searchParams } =
            new URL(request.url);


        // ==========================================
        // PAGINATION
        // ==========================================

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
                100
            );

        const skip =
            (page - 1) * limit;


        // ==========================================
        // SEARCH
        // ==========================================

        const search =
            searchParams
                .get("search")
                ?.trim() || "";


        // ==========================================
        // WHERE CONDITION
        // ==========================================

        const where = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {};


        // ==========================================
        // FETCH USERS + TOTAL COUNT
        // ==========================================

        const [
            users,
            totalUsers,
        ] = await Promise.all([

            prisma.user.findMany({

                where,

                skip,

                take: limit,

                orderBy: {
                    createdAt: "desc",
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

                },

            }),

            prisma.user.count({
                where,
            }),

        ]);


        // ==========================================
        // PAGINATION
        // ==========================================

        const totalPages =
            Math.ceil(
                totalUsers / limit
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return successResponse(

            "Users fetched successfully",

            {
                users,

                pagination: {

                    currentPage: page,
                    limit,
                    totalUsers,
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
            "Get Admin Users Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );

    }

}