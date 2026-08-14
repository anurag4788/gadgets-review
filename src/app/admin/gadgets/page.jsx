"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import gadgetService from "@/services/gadgetService";
import brandService from "@/services/brandService";
import categoryService from "@/services/categoryService";

export default function AdminGadgetsPage() {

    // ==========================================
    // GADGETS
    // ==========================================

    const [gadgets, setGadgets] =
        useState([]);


    // ==========================================
    // BRANDS / CATEGORIES
    // ==========================================

    const [brands, setBrands] =
        useState([]);

    const [categories, setCategories] =
        useState([]);


    // ==========================================
    // FILTERS
    // ==========================================

    const [search, setSearch] =
        useState("");

    const [brand, setBrand] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [sort, setSort] =
        useState("newest");


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
    // LOAD BRANDS + CATEGORIES
    // ==========================================

    useEffect(() => {

        async function loadFilters() {

            try {

                const [
                    brandsResponse,
                    categoriesResponse,
                ] = await Promise.all([

                    brandService.getAll(),

                    categoryService.getAll(),

                ]);


                setBrands(
                    brandsResponse.data.data.brands
                );

                setCategories(
                    categoriesResponse.data.data
                );


            } catch (error) {

                console.error(
                    "Load Filters Error:",
                    error
                );

            }

        }

        loadFilters();

    }, []);


    // ==========================================
    // LOAD GADGETS
    // ==========================================

    async function loadGadgets() {

        try {

            setLoading(true);
            setError("");


            const response =
                await gadgetService.getAll({

                    page,

                    limit: 10,

                    search,

                    brand,

                    category,

                    sort,

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


    // ==========================================
    // LOAD WHEN FILTERS/PAGE CHANGE
    // ==========================================

    useEffect(() => {

        loadGadgets();

    }, [
        page,
        search,
        brand,
        category,
        sort,
    ]);


    // ==========================================
    // DELETE GADGET
    // ==========================================

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


            await gadgetService.delete(
                slug
            );


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
    // BRAND FILTER
    // ==========================================

    function handleBrandChange(event) {

        setBrand(
            event.target.value
        );

        setPage(1);

    }


    // ==========================================
    // CATEGORY FILTER
    // ==========================================

    function handleCategoryChange(event) {

        setCategory(
            event.target.value
        );

        setPage(1);

    }


    // ==========================================
    // SORT
    // ==========================================

    function handleSortChange(event) {

        setSort(
            event.target.value
        );

        setPage(1);

    }


    // ==========================================
    // RESET FILTERS
    // ==========================================

    function handleReset() {

        setSearch("");

        setBrand("");

        setCategory("");

        setSort("newest");

        setPage(1);

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading && !pagination) {

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


    // ==========================================
    // ERROR
    // ==========================================

    if (error && !pagination) {

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
                    Manage Gadgets
                </h1>


                <Link
                    href="/admin/gadgets/create"
                >
                    Add Gadget
                </Link>

            </div>


            {/* ==================================
                FILTERS
            ================================== */}

            <section>

                <h2>
                    Search & Filters
                </h2>


                {/* SEARCH */}

                <input
                    type="text"
                    placeholder="Search gadget or model..."
                    value={search}
                    onChange={
                        handleSearchChange
                    }
                />


                {/* BRAND */}

                <select
                    value={brand}
                    onChange={
                        handleBrandChange
                    }
                >

                    <option value="">
                        All Brands
                    </option>


                    {brands.map(
                        (brandItem) => (

                            <option
                                key={
                                    brandItem.id
                                }
                                value={
                                    brandItem.slug
                                }
                            >
                                {
                                    brandItem.name
                                }
                            </option>

                        )
                    )}

                </select>


                {/* CATEGORY */}

                <select
                    value={category}
                    onChange={
                        handleCategoryChange
                    }
                >

                    <option value="">
                        All Categories
                    </option>


                    {categories.map(
                        (categoryItem) => (

                            <option
                                key={
                                    categoryItem.id
                                }
                                value={
                                    categoryItem.slug
                                }
                            >
                                {
                                    categoryItem.name
                                }
                            </option>

                        )
                    )}

                </select>


                {/* SORT */}

                <select
                    value={sort}
                    onChange={
                        handleSortChange
                    }
                >

                    <option value="newest">
                        Newest
                    </option>

                    <option value="oldest">
                        Oldest
                    </option>

                    <option value="highest">
                        Highest Rated
                    </option>

                    <option value="lowest">
                        Lowest Rated
                    </option>

                    <option value="az">
                        Name: A-Z
                    </option>

                    <option value="za">
                        Name: Z-A
                    </option>

                </select>


                {/* RESET */}

                <button
                    type="button"
                    onClick={handleReset}
                >
                    Reset Filters
                </button>

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
                LOADING DURING FILTER
            ================================== */}

            {loading && (

                <p>
                    Loading...
                </p>

            )}


            {/* ==================================
                GADGET LIST
            ================================== */}

            {!loading &&
            gadgets.length === 0 ? (

                <p>
                    No gadgets found.
                </p>

            ) : (

                <div>

                    {gadgets.map(
                        (gadget) => (

                            <article
                                key={
                                    gadget.id
                                }
                            >

                                {/* IMAGE */}

                                {gadget.image ? (

                                    <img
                                        src={
                                            gadget.image
                                        }
                                        alt={
                                            gadget.name
                                        }
                                        width={100}
                                        height={100}
                                    />

                                ) : (

                                    <div>
                                        No Image
                                    </div>

                                )}


                                {/* NAME */}

                                <h2>
                                    {gadget.name}
                                </h2>


                                {/* MODEL */}

                                <p>
                                    Model:{" "}
                                    {gadget.model}
                                </p>


                                {/* BRAND */}

                                <p>
                                    Brand:{" "}
                                    {
                                        gadget.brand.name
                                    }
                                </p>


                                {/* CATEGORY */}

                                <p>
                                    Category:{" "}
                                    {
                                        gadget.category.name
                                    }
                                </p>


                                {/* RATING */}

                                <p>
                                    ⭐{" "}
                                    {
                                        gadget.avgRating
                                    }
                                </p>


                                {/* RELEASE YEAR */}

                                <p>
                                    Release Year:{" "}
                                    {
                                        gadget.releaseYear ||
                                        "N/A"
                                    }
                                </p>


                                {/* EDIT */}

                                <Link
                                    href={
                                        `/admin/gadgets/${gadget.slug}/edit`
                                    }
                                >
                                    Edit
                                </Link>


                                {/* DELETE */}

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

                                    {
                                        deleting ===
                                        gadget.slug
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
                            !pagination.hasPreviousPage ||
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
                            !pagination.hasNextPage ||
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