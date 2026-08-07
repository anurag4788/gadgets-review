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
import cloudinary, {
    getPublicIdFromUrl,
} from "@/lib/cloudinary";

// GET SINGLE BRAND
export async function GET(
    request,
    { params }
) {

    try {
        const { slug } = await params;
        const brand =
            await prisma.brand.findUnique({
                where: {
                    slug,
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    logo: true,
                    description: true,
                    website: true,
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
                },
            });
        if (!brand) {
            return errorResponse(
                "Brand not found",
                404
            );
        }

        return successResponse(
            "Brand fetched successfully",
            brand,
            200
        );
    } catch(error) {
        console.error(
            "Get Brand Error:",
            error
        );
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}
// UPDATE BRAND
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
            brandSchema.safeParse(body);

        if(!result.success){
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

        const newSlug =
            createSlug(name);

        const brand =
            await prisma.brand.findUnique({
                where:{
                    slug,
                },
            });
        if(!brand){
            return errorResponse(
                "Brand not found",
                404
            );
        }

        // Delete old logo if replaced

if (
    logo &&
    brand.logo &&
    logo !== brand.logo
) {

    const oldPublicId =
        getPublicIdFromUrl(
            brand.logo
        );


    if (oldPublicId) {

        await cloudinary.uploader.destroy(
            oldPublicId
        );

    }

}
        const updatedBrand =
            await prisma.brand.update({
                where:{
                    slug,
                },
                data:{
                    name,
                    slug:newSlug,
                    logo: logo || null,
                    description:
                        description || null,
                    website:
                        website || null,
                },
            });
        return successResponse(
            "Brand updated successfully",
            updatedBrand,
            200
        );
    } catch(error) {
        console.error(
            "Update Brand Error:",
            error
        );
        return errorResponse(
            "Internal Server Error",
            500
        );
    }
}


// DELETE BRAND

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
        const brand =
    await prisma.brand.findUnique({
        where: {
            slug,
        },

        select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
        },
    });
        if(!brand){
            return errorResponse(
                "Brand not found",
                404
            );
        }
        if (brand.logo) {

    const publicId =
        getPublicIdFromUrl(
            brand.logo
        );

    if (publicId) {

        await cloudinary.uploader.destroy(
            publicId
        );

    }

}
        await prisma.brand.delete({
    where: {
        id: brand.id,
    },
});
        return successResponse(
            "Brand deleted successfully",
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
        "Delete Brand Error:",
        error
    );

    return errorResponse(
        "Internal Server Error",
        500
    );

}
}