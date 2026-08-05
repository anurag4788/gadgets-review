import { prisma } from "@/lib/prisma";

import {
    authenticate,
    requireAdmin,
} from "@/lib/auth";

import { createSlug } from "@/lib/slug";

import { brandSchema } from "@/validations/brandValidations";
import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";


export async function POST(request) {
    try {
        // Authentication
        const user =
            await authenticate(request);

        // Authorization
        requireAdmin(user);

        // Read body
        const body =
            await request.json();

        // Validation
        const result =
            brandSchema.safeParse(body);

        if (!result.success) {
            return errorResponse(
                result.error.issues[0].message,
                400
            );
        }

        const {
            name,
            logo,
            description,
            website,
        } = result.data;

        // Create slug
        const slug =
            createSlug(name);
        // Duplicate check
        const existingBrand =
            await prisma.brand.findFirst({
                where: {
                    OR: [
                        {
                            name: {
                                equals: name,
                                mode: "insensitive",
                            },
                        },
                        {
                            slug,
                        }
                    ]
                }
            });
        if (existingBrand) {
            return errorResponse(
                "Brand already exists",
                409
            );
        }
        // Create brand
        const brand =
            await prisma.brand.create({
                data: {
                    name,
                    slug,
                    logo:
                        logo || null,
                    description:
                        description || null,
                    website:
                        website || null,
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    logo: true,
                    description: true,
                    website: true,
                    isActive: true,
                    createdAt: true,
                }
            });
        return successResponse(
            "Brand created successfully",
            brand,
            201
        );
    }
    catch (error) {
        console.error(
            "Create Brand Error:",
            error
        );
        if (error.message === "Unauthorized") {
            return errorResponse(
                "Unauthorized",
                401
            );
        }
        if (error.message === "Forbidden") {

            return errorResponse(
                "Forbidden",
                403
            );
        }
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        // Pagination
        const page = Number(searchParams.get("page")) || 1;
        const limit =Number(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;
        // Search
        const search = searchParams.get("search") || "";

        // Fetch Brands
        const brands =
            await prisma.brand.findMany({
                where: {
                    isActive: true,
                    ...(search && {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    }),
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    logo: true,
                    description: true,
                    website: true,
                    createdAt: true,
                },
            });

        // Total Count
        const totalBrands =
            await prisma.brand.count({
                where: {
                    isActive: true,
                    ...(search && {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    }),
                },
            });
        return successResponse(
            "Brands fetched successfully",
            {
                brands,
                pagination: {
                    currentPage: page,
                    limit,
                    totalBrands,
                    totalPages:
                        Math.ceil(
                            totalBrands / limit
                        ),
                },
            },
            200
        );
    } catch(error) {
        console.error(
            "Get Brands Error:",
            error
        );
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}