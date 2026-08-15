"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import brandService from "@/services/brandService";

export default function AdminBrandsPage() {

    // ==========================================
    // BRANDS
    // ==========================================

    const [brands, setBrands] =
        useState([]);


    // ==========================================
    // SEARCH
    // ==========================================

    const [search, setSearch] =
        useState("");


    // ==========================================
    // PAGINATION
    // ==========================================

    const [page, setPage] =
        useState(1);

    const [pagination, setPagination] =
        useState(null);


    // ==========================================
    // STATES
    // ==========================================

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deleting, setDeleting] =
        useState(null);


    // ==========================================
    // LOAD BRANDS
    // ==========================================

    async function loadBrands() {

        try {

            setLoading(true);
            setError("");


            const response =
                await brandService.getAll({

                    page,

                    limit: 10,

                    search,

                });


            const data =
                response.data.data;


            setBrands(
                data.brands
            );


            setPagination(
                data.pagination
            );


        } catch (error) {

            console.error(
                "Admin Brands Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load brands."
            );


        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // LOAD WHEN PAGE / SEARCH CHANGES
    // ==========================================

    useEffect(() => {

        loadBrands();

    }, [
        page,
        search,
    ]);


    // ==========================================
    // SEARCH
    // ==========================================

    function handleSearchChange(event) {

        setSearch(
            event.target.value
        );

        setPage(1);

    }


    // ==========================================
    // DELETE BRAND
    // ==========================================

    async function handleDelete(slug) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this brand?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeleting(slug);


            await brandService.delete(
                slug
            );


            // Remove deleted brand
            // from current list

            setBrands((previous) =>
                previous.filter(
                    (brand) =>
                        brand.slug !== slug
                )
            );


        } catch (error) {

            console.error(
                "Delete Brand Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to delete brand."
            );


        } finally {

            setDeleting(null);

        }

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading && !pagination) {

        return (

            <main>

                <h1>
                    Manage Brands
                </h1>

                <p>
                    Loading brands...
                </p>

            </main>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error && !pagination) {

        return (

            <main>

                <h1>
                    Manage Brands
                </h1>

                <p>
                    {error}
                </p>


                <button
                    onClick={loadBrands}
                >
                    Try Again
                </button>

            </main>

        );

    }


    // ==========================================
    // PAGINATION HELPERS
    // ==========================================

    const hasPreviousPage =
        pagination &&
        pagination.currentPage > 1;


    const hasNextPage =
        pagination &&
        pagination.currentPage <
            pagination.totalPages;


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
                    Manage Brands
                </h1>


                <Link
                    href="/admin/brands/create"
                >
                    Add Brand
                </Link>

            </div>


            {/* ==================================
                SEARCH
            ================================== */}

            <section>

                <h2>
                    Search Brands
                </h2>


                <input
                    type="text"
                    placeholder="Search brand..."
                    value={search}
                    onChange={
                        handleSearchChange
                    }
                />


                {search && (

                    <button
                        type="button"
                        onClick={() => {

                            setSearch("");

                            setPage(1);

                        }}
                    >
                        Clear
                    </button>

                )}

            </section>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* ==================================
                LOADING
            ================================== */}

            {loading && (

                <p>
                    Loading...
                </p>

            )}


            {/* ==================================
                BRAND LIST
            ================================== */}

            {!loading &&
            brands.length === 0 ? (

                <p>
                    No brands found.
                </p>

            ) : (

                <div>

                    {brands.map(
                        (brand) => (

                            <article
                                key={
                                    brand.id
                                }
                            >

                                {/* LOGO */}

                                {brand.logo ? (

                                    <img
                                        src={
                                            brand.logo
                                        }
                                        alt={
                                            brand.name
                                        }
                                        width={100}
                                        height={100}
                                    />

                                ) : (

                                    <div>
                                        No Logo
                                    </div>

                                )}


                                {/* NAME */}

                                <h2>
                                    {brand.name}
                                </h2>


                                {/* DESCRIPTION */}

                                {brand.description && (

                                    <p>
                                        {
                                            brand.description
                                        }
                                    </p>

                                )}


                                {/* WEBSITE */}

                                {brand.website && (

                                    <p>

                                        Website:{" "}

                                        <a
                                            href={
                                                brand.website
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {
                                                brand.website
                                            }
                                        </a>

                                    </p>

                                )}


                                {/* CREATED DATE */}

                                <p>

                                    Created:{" "}

                                    {new Date(
                                        brand.createdAt
                                    ).toLocaleDateString()}

                                </p>


                                {/* EDIT */}

                                <Link
                                    href={
                                        `/admin/brands/${brand.slug}/edit`
                                    }
                                >
                                    Edit
                                </Link>


                                {/* DELETE */}

                                <button
                                    onClick={() =>
                                        handleDelete(
                                            brand.slug
                                        )
                                    }
                                    disabled={
                                        deleting ===
                                        brand.slug
                                    }
                                >

                                    {
                                        deleting ===
                                        brand.slug
                                            ? "Deleting..."
                                            : "Delete"
                                    }

                                </button>

                            </article>

                        )
                    )}

                </div>

            )}


            {/* ==================================
                PAGINATION
            ================================== */}

            {pagination && (

                <div>

                    <button
                        disabled={
                            !hasPreviousPage ||
                            loading
                        }
                        onClick={() =>
                            setPage(
                                (previous) =>
                                    previous - 1
                            )
                        }
                    >
                        Previous
                    </button>


                    <span>

                        Page{" "}
                        {
                            pagination.currentPage
                        }
                        {" "}of{" "}
                        {
                            pagination.totalPages
                        }

                    </span>


                    <button
                        disabled={
                            !hasNextPage ||
                            loading
                        }
                        onClick={() =>
                            setPage(
                                (previous) =>
                                    previous + 1
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