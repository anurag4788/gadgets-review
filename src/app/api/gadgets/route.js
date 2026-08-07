import { prisma } from "@/lib/prisma";

import {
    authenticate,
    requireAdmin,
} from "@/lib/auth";

import { createSlug } from "@/lib/slug";

import { createGadgetSchema } from "@/validations/gadgetValidations";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";

// =========================================
// CREATE GADGET
// =========================================

export async function POST(request) {
    try {
        // Authenticate Admin

        const user =
            await authenticate(request);

        requireAdmin(user);
        // Request Body

        const body =
            await request.json();
        // Validation
        const result =
            createGadgetSchema.safeParse(body);
        if (!result.success) {
            return errorResponse(
                result.error.issues[0].message,
                400
            );
        }
        const {
            name,
            model,
            description,
            image,
            releaseYear,
            brandId,
            categoryId,
        } = result.data;
        // Create Slug
        const slug =
            createSlug(name);
        // Check Duplicate Gadget
        const existingGadget = await prisma.gadget.findFirst({
    where: {
        OR: [
            {
                slug,
            },
            {
                AND: [
                    {
                        name: {
                            equals: name,
                            mode: "insensitive",
                        },
                    },
                    {
                        model: {
                            equals: model,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        ],
    },
});
        if (existingGadget) {
            return errorResponse(
                "Gadget already exists",
                409
            );
        }
        // Check Brand

        const brand =
            await prisma.brand.findUnique({
                where: {
                    id: brandId,
                },
            });
        if (!brand) {
            return errorResponse(
                "Brand not found",
                404
            );
        }
        // Check Category

        const category =
            await prisma.category.findUnique({
                where: {
                    id: categoryId,
                },
            });

        if (!category) {
            return errorResponse(
                "Category not found",
                404
            );
        }
        // Create Gadget

        const gadget =
            await prisma.gadget.create({
                data: {
                    name,
                    slug,
                    model,
                    description,
                    image:
                        image || null,
                    releaseYear:
                        releaseYear || null,
                    brandId,
                    categoryId,
                },
                include: {
                    brand: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            });
        return successResponse(
            "Gadget created successfully",
            gadget,
            201
        );
    } catch (error) {
        console.error(
            "Create Gadget Error:",
            error
        );
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}

// =========================================
// GET ALL GADGETS
// =========================================

export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        // -------------------------
        // Query Parameters
        // -------------------------

        const page = Math.max(
            Number(searchParams.get("page")) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number(searchParams.get("limit")) || 10,
                1
            ),
            50
        );
        const search =
            searchParams.get("search")?.trim() || "";

        const brand =
            searchParams.get("brand")?.trim() || "";

        const category =
            searchParams.get("category")?.trim() || "";

        const year =
            searchParams.get("year");

        const sort =
            searchParams.get("sort") || "newest";

        const skip =
            (page - 1) * limit;

        // -------------------------
        // Filters
        // -------------------------

        const where = {};
        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    model: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (brand) {
            where.brand = {
                slug: brand,
            };
        }
        if (category) {
            where.category = {
                slug: category,
            };
        }
        if (year) {
            where.releaseYear =
                Number(year);
        }

        // -------------------------
        // Sorting
        // -------------------------

        let orderBy = {
            createdAt: "desc",
        };
        switch (sort) {
            case "highest":
                orderBy = {
                    avgRating: "desc",
                };
                break;
            case "lowest":
                orderBy = {
                    avgRating: "asc",
                };
                break;
            case "oldest":
                orderBy = {
                    createdAt: "asc",
                };
                break;
            case "az":
                orderBy = {
                    name: "asc",
                };
                break;
            case "za":
                orderBy = {
                    name: "desc",
                };
                break;
            default:
                orderBy = {
                    createdAt: "desc",
                };
        }

        // -------------------------
        // Fetch Data
        // -------------------------

        const [total, gadgets] =
            await Promise.all([
                prisma.gadget.count({
                    where,
                }),
                prisma.gadget.findMany({
                    where,
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        model: true,
                        image: true,
                        avgRating: true,
                        releaseYear: true,
                        createdAt: true,
                        brand: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                    orderBy,
                    skip,
                    take: limit,
                }),
            ]);
        // -------------------------
        // Response
        // -------------------------

        return successResponse(
            "Gadgets fetched successfully",
            {
                gadgets,
                pagination: {
                    totalItems: total,
                    currentPage: page,
                    totalPages:
                        Math.ceil(total / limit),
                    limit,
                    hasNextPage:
                        page <
                        Math.ceil(total / limit),
                    hasPreviousPage:
                        page > 1,
                },
            },
            200
        );
    } catch (error) {
        console.error(
            "Get Gadgets Error:",
            error
        );
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}