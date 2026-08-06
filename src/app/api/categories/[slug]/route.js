import { prisma } from "@/lib/prisma";

import {
    authenticate,
    requireAdmin,
} from "@/lib/auth";

import { createSlug } from "@/lib/slug";

import { categorySchema } from "@/validations/categoryValidations";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";



// ==============================
// GET SINGLE CATEGORY
// ==============================

export async function GET(
    request,
    { params }
) {
    try {
        const { slug } = await params;

        const category =
            await prisma.category.findUnique({
                where: {
                    slug,
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,

                    gadgets: {
                        select: {
                            id: true,
                            name: true,
                            model: true,
                            image: true,
                            releaseYear: true,
                            createdAt: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },

                    createdAt: true,
                    updatedAt: true,
                },
            });

        if (!category) {
            return errorResponse(
                "Category not found",
                404
            );
        }

        return successResponse(
            "Category fetched successfully",
            category,
            200
        );

    } catch (error) {

        console.error(
            "Get Category Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}



// ==============================
// UPDATE CATEGORY
// ==============================

export async function PUT(
    request,
    { params }
) {
    try {

        const user =
            await authenticate(request);

        requireAdmin(user);

        const { slug } =
            await params;

        const body =
            await request.json();

        const result =
            categorySchema.safeParse(body);

        if (!result.success) {
            return errorResponse(
                result.error.issues[0].message,
                400
            );
        }

        const {
            name,
            description,
        } = result.data;

        const newSlug =
            createSlug(name);

        const category =
            await prisma.category.findUnique({
                where: {
                    slug,
                },
            });

        if (!category) {
            return errorResponse(
                "Category not found",
                404
            );
        }

        const duplicate =
            await prisma.category.findFirst({
                where: {
                    AND: [
                        {
                            id: {
                                not: category.id,
                            },
                        },
                        {
                            OR: [
                                {
                                    name: {
                                        equals: name,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    slug: newSlug,
                                },
                            ],
                        },
                    ],
                },
            });
        if (duplicate) {
            return errorResponse(
                "Category already exists",
                409
            );
        }
        const updatedCategory =
            await prisma.category.update({
                where: {
                    slug,
                },
                data: {
                    name,
                    slug: newSlug,
                    description:
                        description || null,
                },
            });
        return successResponse(
            "Category updated successfully",
            updatedCategory,
            200
        );
    } catch (error) {
        console.error(
            "Update Category Error:",
            error
        );
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}



// ==============================
// DELETE CATEGORY
// ==============================

export async function DELETE(
    request,
    { params }
) {
    try {
        const user =
            await authenticate(request);
        requireAdmin(user);
        const { slug } =
            await params;
        const category =
            await prisma.category.findUnique({
                where: {
                    slug,
                },
            });
        if (!category) {
            return errorResponse(
                "Category not found",
                404
            );
        }
        await prisma.category.delete({
            where: {
                slug,
            },
        });
        return successResponse(
            "Category deleted successfully",
            null,
            200
        );
    } catch (error) {
        console.error(
            "Delete Category Error:",
            error
        );
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}