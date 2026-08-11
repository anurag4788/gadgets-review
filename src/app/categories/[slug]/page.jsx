"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import categoryService from "@/services/categoryService";

export default function CategoryPage() {

    const params = useParams();

    const slug = params.slug;

    const [category, setCategory] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
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

                setCategory(
                    response.data.data
                );

            } catch (error) {

                console.error(
                    "Get Category Error:",
                    error
                );

                if (
                    error.response?.status === 404
                ) {

                    setError(
                        "Category not found."
                    );

                } else {

                    setError(
                        "Failed to load category."
                    );

                }

            } finally {

                setLoading(false);

            }

        }

        if (slug) {

            loadCategory();

        }

    }, [slug]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <main>

                <p>
                    Loading category...
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

                <p>
                    {error}
                </p>

                <Link href="/gadgets">
                    Back to Gadgets
                </Link>

            </main>
        );

    }


    // ==========================================
    // NOT FOUND
    // ==========================================

    if (!category) {

        return (
            <main>

                <p>
                    Category not found.
                </p>

            </main>
        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <main>

            <Link href="/gadgets">
                ← Back to Gadgets
            </Link>


            {/* CATEGORY INFORMATION */}

            <section>

                <h1>
                    {category.name}
                </h1>

                <p>
                    {category.description}
                </p>

            </section>


            {/* GADGETS */}

            <section>

                <h2>
                    {category.name} Gadgets
                </h2>


                {category.gadgets.length === 0 ? (

                    <p>
                        No gadgets found.
                    </p>

                ) : (

                    <div>

                        {category.gadgets.map(
                            (gadget) => (

                                <article
                                    key={gadget.id}
                                >

                                    {gadget.image && (

                                        <img
                                            src={
                                                gadget.image
                                            }
                                            alt={
                                                gadget.name
                                            }
                                            width={200}
                                        />

                                    )}


                                    <h3>
                                        {gadget.name}
                                    </h3>


                                    <p>
                                        Model:{" "}
                                        {gadget.model}
                                    </p>


                                    <p>
                                        Release Year:{" "}
                                        {
                                            gadget.releaseYear
                                        }
                                    </p>


                                    <Link
                                        href={`/gadgets/${gadget.name
                                            .toLowerCase()
                                            .replaceAll(
                                                " ",
                                                "-"
                                            )}`}
                                    >
                                        View Gadget
                                    </Link>

                                </article>

                            )
                        )}

                    </div>

                )}

            </section>

        </main>

    );

}