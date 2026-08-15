"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import categoryService from "@/services/categoryService";

export default function CreateCategoryPage() {

    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

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


            await categoryService.create({

                name:
                    form.name.trim(),

                description:
                    form.description.trim() ||
                    null,

            });


            setSuccess(
                "Category created successfully."
            );


            setTimeout(() => {

                router.push(
                    "/admin/categories"
                );

            }, 700);


        } catch (error) {

            console.error(
                "Create Category Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to create category."
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
                Create Category
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
                        placeholder="e.g. Smartphones"
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
                        placeholder="Category description..."
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
                    CREATE
                ========================== */}

                <button
                    type="submit"
                    disabled={submitting}
                >

                    {submitting
                        ? "Creating..."
                        : "Create Category"}

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