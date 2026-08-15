"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import brandService from "@/services/brandService";
import api from "@/lib/api";

export default function EditBrandPage() {

    const params = useParams();
    const router = useRouter();

    const slug = params.slug;


    // ==========================================
    // FORM
    // ==========================================

    const [form, setForm] = useState({
        name: "",
        description: "",
        website: "",
    });


    // ==========================================
    // EXISTING LOGO
    // ==========================================

    const [currentLogo, setCurrentLogo] =
        useState("");


    // ==========================================
    // NEW LOGO
    // ==========================================

    const [image, setImage] =
        useState(null);

    const [preview, setPreview] =
        useState("");


    // ==========================================
    // STATES
    // ==========================================

    const [loading, setLoading] =
        useState(true);

    const [uploading, setUploading] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // LOAD BRAND
    // ==========================================

    useEffect(() => {

        async function loadBrand() {

            try {

                setLoading(true);
                setError("");


                const response =
                    await brandService.getBySlug(
                        slug
                    );


                const brand =
                    response.data.data;


                setForm({
                    name:
                        brand.name || "",

                    description:
                        brand.description || "",

                    website:
                        brand.website || "",
                });


                setCurrentLogo(
                    brand.logo || ""
                );


            } catch (error) {

                console.error(
                    "Load Brand Error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Failed to load brand."
                );


            } finally {

                setLoading(false);

            }

        }


        if (slug) {

            loadBrand();

        }

    }, [slug]);


    // ==========================================
    // INPUT CHANGE
    // ==========================================

    function handleChange(event) {

        const {
            name,
            value,
        } = event.target;


        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    }


    // ==========================================
    // IMAGE CHANGE
    // ==========================================

    function handleImageChange(event) {

        const file =
            event.target.files?.[0];


        if (!file) {

            return;

        }


        if (!file.type.startsWith("image/")) {

            setError(
                "Please select a valid image."
            );

            return;

        }


        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Image size must be less than 5MB."
            );

            return;

        }


        setError("");

        setImage(file);


        const previewUrl =
            URL.createObjectURL(file);


        setPreview(previewUrl);

    }


    // ==========================================
    // UPLOAD IMAGE
    // ==========================================

    async function uploadImage() {

        if (!image) {

            return null;

        }


        const formData =
            new FormData();


        formData.append(
            "image",
            image
        );


        setUploading(true);


        try {

            const response =
                await api.post(
                    "/upload",
                    formData
                );


            return response.data.data.url;

        } finally {

            setUploading(false);

        }

    }


    // ==========================================
    // SUBMIT
    // ==========================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!form.name.trim()) {

            setError(
                "Brand name is required."
            );

            return;

        }


        try {

            setSubmitting(true);


            // ==================================
            // LOGO
            // ==================================

            let logoUrl =
                currentLogo || null;


            // Upload only if a new image
            // was selected

            if (image) {

                logoUrl =
                    await uploadImage();

            }


            // ==================================
            // UPDATE BRAND
            // ==================================

            await brandService.update(
                slug,
                {
                    name:
                        form.name.trim(),

                    logo:
                        logoUrl,

                    description:
                        form.description.trim() ||
                        null,

                    website:
                        form.website.trim() ||
                        null,
                }
            );


            setSuccess(
                "Brand updated successfully."
            );


            setTimeout(() => {

                router.push(
                    "/admin/brands"
                );

            }, 700);


        } catch (error) {

            console.error(
                "Update Brand Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to update brand."
            );


        } finally {

            setSubmitting(false);

        }

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main>

                <h1>
                    Edit Brand
                </h1>

                <p>
                    Loading brand...
                </p>

            </main>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error && !form.name) {

        return (

            <main>

                <h1>
                    Edit Brand
                </h1>

                <p>
                    {error}
                </p>


                <button
                    onClick={() =>
                        router.push(
                            "/admin/brands"
                        )
                    }
                >
                    Back to Brands
                </button>

            </main>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <main>

            <h1>
                Edit Brand
            </h1>


            <form
                onSubmit={
                    handleSubmit
                }
            >

                {/* ==========================
                    NAME
                ========================== */}

                <div>

                    <label htmlFor="name">
                        Brand Name
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={
                            handleChange
                        }
                        required
                    />

                </div>


                {/* ==========================
                    DESCRIPTION
                ========================== */}

                <div>

                    <label htmlFor="description">
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        rows={5}
                        value={
                            form.description
                        }
                        onChange={
                            handleChange
                        }
                    />

                </div>


                {/* ==========================
                    WEBSITE
                ========================== */}

                <div>

                    <label htmlFor="website">
                        Website
                    </label>

                    <input
                        id="website"
                        name="website"
                        type="url"
                        value={form.website}
                        onChange={
                            handleChange
                        }
                    />

                </div>


                {/* ==========================
                    CURRENT LOGO
                ========================== */}

                {currentLogo && !preview && (

                    <div>

                        <p>
                            Current Logo
                        </p>

                        <img
                            src={currentLogo}
                            alt={
                                `${form.name} logo`
                            }
                            width={150}
                            height={150}
                        />

                    </div>

                )}


                {/* ==========================
                    NEW LOGO
                ========================== */}

                <div>

                    <label htmlFor="logo">
                        Replace Logo
                    </label>

                    <input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={
                            handleImageChange
                        }
                    />

                </div>


                {/* ==========================
                    NEW LOGO PREVIEW
                ========================== */}

                {preview && (

                    <div>

                        <p>
                            New Logo Preview
                        </p>

                        <img
                            src={preview}
                            alt="New logo preview"
                            width={150}
                            height={150}
                        />

                    </div>

                )}


                {/* ==========================
                    ERROR
                ========================== */}

                {error && (

                    <p>
                        {error}
                    </p>

                )}


                {/* ==========================
                    SUCCESS
                ========================== */}

                {success && (

                    <p>
                        {success}
                    </p>

                )}


                {/* ==========================
                    UPDATE
                ========================== */}

                <button
                    type="submit"
                    disabled={
                        submitting ||
                        uploading
                    }
                >

                    {uploading
                        ? "Uploading Logo..."
                        : submitting
                            ? "Updating Brand..."
                            : "Update Brand"}

                </button>


                {/* ==========================
                    CANCEL
                ========================== */}

                <button
                    type="button"
                    disabled={
                        submitting ||
                        uploading
                    }
                    onClick={() =>
                        router.push(
                            "/admin/brands"
                        )
                    }
                >
                    Cancel
                </button>

            </form>

        </main>

    );

}