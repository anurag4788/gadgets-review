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



// ============================
// CREATE CATEGORY
// ============================

export async function POST(request) {
    try {
        const user = await authenticate(request);

        requireAdmin(user);

        const body = await request.json();

        const result = categorySchema.safeParse(body);

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

        const slug = createSlug(name);

        const existingCategory =
            await prisma.category.findFirst({
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
                        },
                    ],
                },
            });

        if (existingCategory) {
            return errorResponse(
                "Category already exists",
                409
            );
        }

        const category =
            await prisma.category.create({
                data: {
                    name,
                    slug,
                    description:
                        description || null,
                },
            });

        return successResponse(
            "Category created successfully",
            category,
            201
        );
    } catch (error) {
        console.error(
            "Create Category Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}



// ============================
// GET ALL CATEGORIES
// ============================

export async function GET() {
    try {
        const categories =
            await prisma.category.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    createdAt: true,
                },

                orderBy: {
                    name: "asc",
                },
            });

        return successResponse(
            "Categories fetched successfully",
            categories,
            200
        );
    } catch (error) {
        console.error(
            "Get Categories Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}