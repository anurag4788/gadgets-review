"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import categoryService from "@/services/categoryService";

export default function AdminCategoriesPage() {

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deleting, setDeleting] =
        useState(null);


    // ==========================================
    // LOAD CATEGORIES
    // ==========================================

    async function loadCategories() {

        try {

            setLoading(true);
            setError("");

            const response =
                await categoryService.getAll();

            setCategories(
                response.data.data
            );

        } catch (error) {

            console.error(
                "Admin Categories Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load categories."
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        loadCategories();

    }, []);


    // ==========================================
    // DELETE CATEGORY
    // ==========================================

    async function handleDelete(slug) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this category?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setDeleting(slug);

            await categoryService.delete(
                slug
            );


            setCategories((previous) =>
                previous.filter(
                    (category) =>
                        category.slug !== slug
                )
            );

        } catch (error) {

            console.error(
                "Delete Category Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete category."
            );

        } finally {

            setDeleting(null);

        }

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main>

                <h1>
                    Manage Categories
                </h1>

                <p>
                    Loading categories...
                </p>

            </main>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <main>

                <h1>
                    Manage Categories
                </h1>

                <p>
                    {error}
                </p>

                <button
                    onClick={
                        loadCategories
                    }
                >
                    Try Again
                </button>

            </main>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <main>

            {/* ==================================
                HEADER
            ================================== */}

            <div>

                <h1>
                    Manage Categories
                </h1>

                <Link
                    href="/admin/categories/create"
                >
                    Add Category
                </Link>

            </div>


            {/* ==================================
                CATEGORY LIST
            ================================== */}

            {categories.length === 0 ? (

                <p>
                    No categories found.
                </p>

            ) : (

                <div>

                    {categories.map(
                        (category) => (

                            <article
                                key={
                                    category.id
                                }
                            >

                                <h2>
                                    {
                                        category.name
                                    }
                                </h2>


                                {category.description && (

                                    <p>
                                        {
                                            category.description
                                        }
                                    </p>

                                )}


                                <p>
                                    Slug:{" "}
                                    {
                                        category.slug
                                    }
                                </p>


                                <p>
                                    Created:{" "}

                                    {new Date(
                                        category.createdAt
                                    ).toLocaleDateString()}
                                </p>


                                {/* EDIT */}

                                <Link
                                    href={
                                        `/admin/categories/${category.slug}/edit`
                                    }
                                >
                                    Edit
                                </Link>


                                {/* DELETE */}

                                <button
                                    onClick={() =>
                                        handleDelete(
                                            category.slug
                                        )
                                    }
                                    disabled={
                                        deleting ===
                                        category.slug
                                    }
                                >

                                    {
                                        deleting ===
                                        category.slug
                                            ? "Deleting..."
                                            : "Delete"
                                    }

                                </button>

                            </article>

                        )
                    )}

                </div>

            )}

        </main>

    );

}