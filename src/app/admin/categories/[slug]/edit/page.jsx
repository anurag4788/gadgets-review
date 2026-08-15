"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import categoryService from "@/services/categoryService";

export default function EditCategoryPage() {

    const params = useParams();
    const router = useRouter();

    const slug = params.slug;


    // ==========================================
    // FORM
    // ==========================================

    const [form, setForm] = useState({
        name: "",
        description: "",
    });


    // ==========================================
    // STATES
    // ==========================================

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // LOAD CATEGORY
    // ==========================================

    useEffect(() => {

        async function loadCategory() {

            try {

                setLoading(true);
                setError("");

                const response =
                    await categoryService.getBySlug(
                        slug
                    );

                const category =
                    response.data.data;

                setForm({
                    name:
                        category.name || "",

                    description:
                        category.description || "",
                });

            } catch (error) {

                console.error(
                    "Load Category Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load category."
                );

            } finally {

                setLoading(false);

            }

        }


        if (slug) {

            loadCategory();

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
    // SUBMIT
    // ==========================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!form.name.trim()) {

            setError(
                "Category name is required."
            );

            return;

        }


        try {

            setSubmitting(true);


            await categoryService.update(
                slug,
                {
                    name:
                        form.name.trim(),

                    description:
                        form.description.trim() ||
                        null,
                }
            );


            setSuccess(
                "Category updated successfully."
            );


            setTimeout(() => {

                router.push(
                    "/admin/categories"
                );

            }, 700);

        } catch (error) {

            console.error(
                "Update Category Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update category."
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
                    Edit Category
                </h1>

                <p>
                    Loading category...
                </p>

            </main>

        );

    }


    // ==========================================
    // ERROR WHILE LOADING
    // ==========================================

    if (error && !form.name) {

        return (

            <main>

                <h1>
                    Edit Category
                </h1>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        router.push(
                            "/admin/categories"
                        )
                    }
                >
                    Back to Categories
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
                Edit Category
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
                        Category Name
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
                        value={
                            form.description
                        }
                        onChange={
                            handleChange
                        }
                        rows={5}
                    />

                </div>


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
                    disabled={submitting}
                >

                    {submitting
                        ? "Updating..."
                        : "Update Category"}

                </button>


                {/* ==========================
                    CANCEL
                ========================== */}

                <button
                    type="button"
                    disabled={submitting}
                    onClick={() =>
                        router.push(
                            "/admin/categories"
                        )
                    }
                >
                    Cancel
                </button>

            </form>

        </main>

    );

}