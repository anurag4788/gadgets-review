import { v2 as cloudinary } from "cloudinary";


cloudinary.config({

    cloud_name:
        process.env.CLOUDINARY_CLOUD_NAME,

    api_key:
        process.env.CLOUDINARY_API_KEY,

    api_secret:
        process.env.CLOUDINARY_API_SECRET,

});


export default cloudinary;



export function getPublicIdFromUrl(url) {

    if (!url) return null;


    const parts =
        url.split("/");


    const uploadIndex =
        parts.indexOf("upload");


    if (uploadIndex === -1)
        return null;


    return parts
        .slice(uploadIndex + 2)
        .join("/")
        .split(".")[0];

}