"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import gadgetService from "@/services/gadgetService";

export default function AdminGadgetsPage() {

    const [gadgets, setGadgets] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deleting, setDeleting] =
        useState(null);


    async function loadGadgets() {

        try {

            setLoading(true);
            setError("");

            const response =
                await gadgetService.getAll({
                    page: 1,
                    limit: 50,
                });

            setGadgets(
                response.data.data.gadgets
            );

        } catch (error) {

            console.error(
                "Admin Gadgets Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load gadgets."
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        loadGadgets();

    }, []);


    async function handleDelete(slug) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this gadget?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeleting(slug);

            await gadgetService.delete(slug);

            setGadgets((previous) =>
                previous.filter(
                    (gadget) =>
                        gadget.slug !== slug
                )
            );

        } catch (error) {

            console.error(
                "Delete Gadget Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete gadget."
            );

        } finally {

            setDeleting(null);

        }

    }


    if (loading) {

        return (
            <main>

                <h1>
                    Manage Gadgets
                </h1>

                <p>
                    Loading gadgets...
                </p>

            </main>
        );

    }


    if (error) {

        return (
            <main>

                <h1>
                    Manage Gadgets
                </h1>

                <p>
                    {error}
                </p>

                <button
                    onClick={loadGadgets}
                >
                    Try Again
                </button>

            </main>
        );

    }


    return (

        <main>

            <div>

                <h1>
                    Manage Gadgets
                </h1>

                <Link href="/admin/gadgets/create">
                    Add Gadget
                </Link>

            </div>


            {gadgets.length === 0 ? (

                <p>
                    No gadgets found.
                </p>

            ) : (

                <div>

                    {gadgets.map(
                        (gadget) => (

                            <article
                                key={gadget.id}
                            >

                                {gadget.image && (

                                    <img
                                        src={gadget.image}
                                        alt={gadget.name}
                                        width={100}
                                        height={100}
                                    />

                                )}


                                <h2>
                                    {gadget.name}
                                </h2>


                                <p>
                                    Model:{" "}
                                    {gadget.model}
                                </p>


                                <p>
                                    Brand:{" "}
                                    {gadget.brand.name}
                                </p>


                                <p>
                                    Category:{" "}
                                    {gadget.category.name}
                                </p>


                                <p>
                                    ⭐{" "}
                                    {gadget.avgRating}
                                </p>


                                <p>
                                    Release Year:{" "}
                                    {gadget.releaseYear ||
                                        "N/A"}
                                </p>


                                <Link
                                    href={`/admin/gadgets/${gadget.slug}/edit`}
                                >
                                    Edit
                                </Link>


                                <button
                                    onClick={() =>
                                        handleDelete(
                                            gadget.slug
                                        )
                                    }
                                    disabled={
                                        deleting ===
                                        gadget.slug
                                    }
                                >

                                    {deleting ===
                                    gadget.slug
                                        ? "Deleting..."
                                        : "Delete"}

                                </button>

                            </article>

                        )
                    )}

                </div>

            )}

        </main>

    );

}