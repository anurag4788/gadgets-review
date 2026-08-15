"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import brandService from "@/services/brandService";
import api from "@/lib/api";

export default function CreateBrandPage() {

    const router = useRouter();

    // ==========================================
    // FORM
    // ==========================================

    const [form, setForm] = useState({
        name: "",
        description: "",
        website: "",
    });


    // ==========================================
    // IMAGE
    // ==========================================

    const [image, setImage] =
        useState(null);

    const [preview, setPreview] =
        useState("");


    // ==========================================
    // STATES
    // ==========================================

    const [uploading, setUploading] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


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


        // Basic validation

        if (!file.type.startsWith("image/")) {

            setError(
                "Please select a valid image."
            );

            return;

        }


        // 5 MB limit

        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Image size must be less than 5MB."
            );

            return;

        }


        setError("");

        setImage(file);


        // Preview

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
            // UPLOAD LOGO
            // ==================================

            let logoUrl = null;


            if (image) {

                logoUrl =
                    await uploadImage();

            }


            // ==================================
            // CREATE BRAND
            // ==================================

            await brandService.create({

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

            });


            setSuccess(
                "Brand created successfully."
            );


            // Redirect

            setTimeout(() => {

                router.push(
                    "/admin/brands"
                );

            }, 700);


        } catch (error) {

            console.error(
                "Create Brand Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to create brand."
            );


        } finally {

            setSubmitting(false);

        }

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <main>

            <h1>
                Create Brand
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
                        placeholder="e.g. Apple"
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
                        value={
                            form.description
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Brand description..."
                        rows={5}
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
                        placeholder="https://example.com"
                    />

                </div>


                {/* ==========================
                    LOGO
                ========================== */}

                <div>

                    <label htmlFor="logo">
                        Brand Logo
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
                    PREVIEW
                ========================== */}

                {preview && (

                    <div>

                        <p>
                            Logo Preview
                        </p>

                        <img
                            src={preview}
                            alt="Logo preview"
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
                    SUBMIT
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
                            ? "Creating Brand..."
                            : "Create Brand"}

                </button>


                {/* ==========================
                    CANCEL
                ========================== */}

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/admin/brands"
                        )
                    }
                    disabled={
                        submitting ||
                        uploading
                    }
                >
                    Cancel
                </button>

            </form>

        </main>

    );

}