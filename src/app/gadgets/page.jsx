"use client";

import { useEffect, useState } from "react";

import gadgetService from "@/services/gadgetService";
import GadgetCard from "@/components/gadgets/GadgetCard";

export default function GadgetsPage() {

    const [gadgets, setGadgets] =
        useState([]);

    const [pagination, setPagination] =
        useState({
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    async function loadGadgets(page = 1) {

        try {

            setLoading(true);
            setError("");

            const response =
                await gadgetService.getAll({
                    page,
                    limit: 10,
                });

            const data =
                response.data.data;

            setGadgets(
                data.gadgets
            );

            setPagination(
                data.pagination
            );

        } catch (error) {

            console.error(
                "Get Gadgets Error:",
                error
            );

            setError(
                "Failed to load gadgets"
            );

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {

        loadGadgets(1);

    }, []);

    if (loading) {
        return <p>Loading gadgets...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <main>

            <h1>All Gadgets</h1>

            <p>
                {pagination.total} gadgets found
            </p>

            <div>

                {gadgets.length === 0 ? (

                    <p>
                        No gadgets found.
                    </p>

                ) : (

                    gadgets.map(
                        (gadget) => (
                            <GadgetCard
                                key={gadget.id}
                                gadget={gadget}
                            />
                        )
                    )

                )}

            </div>

            {/* Pagination */}

            {pagination.totalPages > 1 && (

                <div>

                    <button
                        disabled={
                            pagination.page <= 1 ||
                            loading
                        }
                        onClick={() =>
                            loadGadgets(
                                pagination.page - 1
                            )
                        }
                    >
                        Previous
                    </button>

                    <span>
                        Page {pagination.page} of{" "}
                        {pagination.totalPages}
                    </span>

                    <button
                        disabled={
                            pagination.page >=
                                pagination.totalPages ||
                            loading
                        }
                        onClick={() =>
                            loadGadgets(
                                pagination.page + 1
                            )
                        }
                    >
                        Next
                    </button>

                </div>

            )}

        </main>
    );
}