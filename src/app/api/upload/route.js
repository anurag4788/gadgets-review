import cloudinary from "@/lib/cloudinary";

import {
    successResponse,
    errorResponse,
} from "@/utils/apiResponse";


export async function POST(request) {
    try {
        const formData =
            await request.formData();

        const file =
            formData.get("image");

        if (!file) {
            return errorResponse(
                "Image is required",
                400
            );
        }
        const bytes =
            await file.arrayBuffer();

        const buffer =
            Buffer.from(bytes);

        const uploadResult =
            await new Promise(
                (resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder:
                                "gadgets-review",
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    ).end(buffer);
                }
            );
        return successResponse(
            "Image uploaded successfully",
            {
                url:
                    uploadResult.secure_url,
                publicId:
                    uploadResult.public_id,
            },
            201
        );
    } catch(error) {
        console.error(
            "Upload Error:",
            error
        );
        return errorResponse(
            "Image upload failed",
            500
        );
    }
}