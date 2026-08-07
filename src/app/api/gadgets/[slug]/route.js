import { prisma } from "@/lib/prisma";
import { authenticate, requireAdmin } from "@/lib/auth";
import { createSlug } from "@/lib/slug";
import cloudinary, { getPublicIdFromUrl } from "@/lib/cloudinary";
import { createGadgetSchema } from "@/validations/gadgetValidations";
import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";

/* ======================================================
   GET SINGLE GADGET
   GET /api/gadgets/[slug]
====================================================== */

export async function GET(request, { params }) {
    try {
        const { slug } = await params;

        const gadget = await prisma.gadget.findUnique({
            where: {
                slug,
            },

            select: {
                id: true,
                name: true,
                slug: true,
                model: true,
                description: true,
                image: true,
                releaseYear: true,
                avgRating: true,

                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                        description: true,
                        website: true,
                    },
                },

                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                    },
                },

                createdAt: true,
                updatedAt: true,
            },
        });

        if (!gadget) {
            return errorResponse(
                "Gadget not found",
                404
            );
        }

        return successResponse(
            "Gadget fetched successfully",
            gadget,
            200
        );
    } catch (error) {
        console.error(
            "Get Gadget Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}

/* ======================================================
   UPDATE GADGET
   PUT /api/gadgets/[slug]
====================================================== */

export async function PUT(request, { params }) {
    try {
        const user =
            await authenticate(request);

        requireAdmin(user);

        const { slug } = await params;

        const body =
            await request.json();

        const parsedData =
            createGadgetSchema.safeParse(body);

        if (!parsedData.success) {
            return errorResponse(
                "Validation Failed",
                400,
                parsedData.error.flatten()
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
        } = parsedData.data;

        const newSlug =
            createSlug(name);

        // Find Gadget

        const gadget =
            await prisma.gadget.findUnique({
                where: {
                    slug,
                },
            });

        if (!gadget) {
            return errorResponse(
                "Gadget not found",
                404
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

        // Check Duplicate Slug

        const existingSlug =
            await prisma.gadget.findFirst({
                where: {
                    slug: newSlug,
                    id: {
                        not: gadget.id,
                    },
                },
            });

        if (existingSlug) {
            return errorResponse(
                "Slug already exists",
                409
            );
        }

        // Check Duplicate Name + Model

        const duplicate =
            await prisma.gadget.findFirst({
                where: {
                    id: {
                        not: gadget.id,
                    },

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
            });

        if (duplicate) {
            return errorResponse(
                "A gadget with this name and model already exists.",
                409
            );
        }

        // Delete old image if replaced

        if (
            image &&
            gadget.image &&
            image !== gadget.image
        ) {

            const oldPublicId =
                getPublicIdFromUrl(
                    gadget.image
                );


            if (oldPublicId) {

                await cloudinary.uploader.destroy(
                    oldPublicId
                );

            }

        }
        // Update Gadget

        const updatedGadget =
            await prisma.gadget.update({
                where: {
                    id: gadget.id,
                },

                data: {
                    name,
                    slug: newSlug,
                    model,
                    description,
                    image: image || null,
                    releaseYear,
                    brandId,
                    categoryId,
                },

                select: {
                    id: true,
                    name: true,
                    slug: true,
                    model: true,
                    description: true,
                    image: true,
                    releaseYear: true,
                    avgRating: true,

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

                    createdAt: true,
                    updatedAt: true,
                },
            });

        return successResponse(
            "Gadget updated successfully",
            updatedGadget,
            200
        );

    } catch (error) {

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

        console.error(
            "Update Gadget Error:",
            error
        );

        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}

/* ======================================================
   DELETE GADGET
   DELETE /api/gadgets/[slug]
====================================================== */

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

        const gadget =
            await prisma.gadget.findUnique({
                where: {
                    slug,
                },

                select: {
                    id: true,
                    name: true,
                    slug: true,
                    image: true,

                },
            });

        if (!gadget) {
            return errorResponse(
                "Gadget not found",
                404
            );
        }

        // Delete Cloudinary image

        if (gadget.image) {

            const publicId =
                getPublicIdFromUrl(
                    gadget.image
                );


            if (publicId) {

                await cloudinary.uploader.destroy(
                    publicId
                );

            }

        }
        await prisma.gadget.delete({
            where: {
                id: gadget.id,
            },
        });
        return successResponse(
            "Gadget deleted successfully",
            null,
            200
        );

    } catch (error) {

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
        console.error(
            "Delete Gadget Error:",
            error
        );
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}