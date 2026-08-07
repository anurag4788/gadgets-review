import { prisma } from "@/lib/prisma";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";

export async function GET(
    request,
    { params }
) {
    try {

        const { slug } =
            await params;

        const { searchParams } =
            new URL(request.url);

        const page =
            Number(searchParams.get("page")) || 1;

        const limit =
            Number(searchParams.get("limit")) || 10;

        const sort =
            searchParams.get("sort") || "newest";

        const skip =
            (page - 1) * limit;

        let orderBy = {
            createdAt: "desc",
        };

        switch (sort) {

            case "oldest":

                orderBy = {
                    createdAt: "asc",
                };

                break;

            case "highest":

                orderBy = {
                    rating: "desc",
                };

                break;

            case "lowest":

                orderBy = {
                    rating: "asc",
                };

                break;

            default:

                orderBy = {
                    createdAt: "desc",
                };

        }

        const gadget =
            await prisma.gadget.findUnique({

                where: {
                    slug,
                },

                select: {

                    id: true,
                    name: true,
                    slug: true,
                    avgRating: true,

                },

            });

        if (!gadget) {

            return errorResponse(
                "Gadget not found",
                404
            );

        }

        const totalReviews =
            await prisma.review.count({

                where: {
                    gadgetId: gadget.id,
                },

            });

        const reviews =
            await prisma.review.findMany({

                where: {
                    gadgetId: gadget.id,
                },

                orderBy,

                skip,

                take: limit,

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

                },

            });

        return successResponse(

            "Reviews fetched successfully",

            {

                gadget,

                pagination: {

                    page,
                    limit,

                    totalReviews,

                    totalPages:
                        Math.ceil(
                            totalReviews / limit
                        ),

                    hasPreviousPage:
                        page > 1,

                    hasNextPage:
                        page <
                        Math.ceil(
                            totalReviews / limit
                        ),

                },

                reviews,

            },

            200

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