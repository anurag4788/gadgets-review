"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import brandService from "@/services/brandService";

export default function BrandPage() {

    const params = useParams();

    const slug = params.slug;

    const [brand, setBrand] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function loadBrand() {

            try {

                setLoading(true);
                setError("");

                const response =
                    await brandService.getBySlug(
                        slug
                    );

                setBrand(
                    response.data.data
                );

            } catch (error) {

                console.error(
                    "Get Brand Error:",
                    error
                );

                if (
                    error.response?.status === 404
                ) {

                    setError(
                        "Brand not found."
                    );

                } else {

                    setError(
                        "Failed to load brand."
                    );

                }

            } finally {

                setLoading(false);

            }

        }

        if (slug) {

            loadBrand();

        }

    }, [slug]);


    // Loading

    if (loading) {

        return (
            <main>
                <p>
                    Loading brand...
                </p>
            </main>
        );

    }


    // Error

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


    if (!brand) {

        return (
            <main>

                <p>
                    Brand not found.
                </p>

            </main>
        );

    }


    return (

        <main>

            <Link href="/gadgets">
                ← Back to Gadgets
            </Link>


            {/* Brand Information */}

            <section>

                {brand.logo && (

                    <img
                        src={brand.logo}
                        alt={brand.name}
                        width={100}
                    />

                )}

                <h1>
                    {brand.name}
                </h1>

                <p>
                    {brand.description}
                </p>


                {brand.website && (

                    <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Official Website
                    </a>

                )}

            </section>


            {/* Gadgets */}

            <section>

                <h2>
                    {brand.name} Gadgets
                </h2>


                {brand.gadgets.length === 0 ? (

                    <p>
                        No gadgets found.
                    </p>

                ) : (

                    <div>

                        {brand.gadgets.map(
                            (gadget) => (

                                <article
                                    key={gadget.id}
                                >

                                    {gadget.image && (

                                        <img
                                            src={gadget.image}
                                            alt={gadget.name}
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
                                        {gadget.releaseYear}
                                    </p>

                                    <Link
                                        href={`/gadgets/${gadget.name
                                            .toLowerCase()
                                            .replaceAll(" ", "-")}`}
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