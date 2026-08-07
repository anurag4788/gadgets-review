import { prisma } from "@/lib/prisma";

import {
    authenticate,
    requireAdmin,
} from "@/lib/auth";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";


export async function GET(request) {

    try {

        // Authenticate

        const user =
            await authenticate(request);


        // Check Admin

        requireAdmin(user);


        const [

            totalUsers,

            totalGadgets,

            totalReviews,

            totalBrands,

            totalCategories,

            totalLikes,

            recentUsers,

            recentReviews,

        ] = await Promise.all([


            prisma.user.count(),


            prisma.gadget.count(),


            prisma.review.count(),


            prisma.brand.count(),


            prisma.category.count(),


            prisma.reviewLike.count(),



            prisma.user.findMany({

                take: 5,

                orderBy: {

                    createdAt: "desc",

                },

                select: {

                    id: true,

                    name: true,

                    email: true,

                    role: true,

                    createdAt: true,

                },

            }),



            prisma.review.findMany({

                take: 5,

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

                        },

                    },

                },

            }),


        ]);



        return successResponse(

            "Dashboard data fetched successfully",

            {

                statistics: {

                    totalUsers,

                    totalGadgets,

                    totalReviews,

                    totalBrands,

                    totalCategories,

                    totalLikes,

                },


                recentUsers,


                recentReviews,


            }

        );


    } catch(error) {


        console.error(

            "Admin Dashboard Error:",

            error

        );


        return errorResponse(

            "Internal Server Error",

            500

        );


    }

}