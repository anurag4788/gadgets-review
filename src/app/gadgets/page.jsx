"use client";

import { useEffect, useState } from "react";

import gadgetService from "@/services/gadgetService";
import brandService from "@/services/brandService";
import categoryService from "@/services/categoryService";

import GadgetCard from "@/components/gadgets/GadgetCard";

import styles from "./page.module.css";

export default function GadgetsPage() {

    const [gadgets, setGadgets] = useState([]);

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });

    const [search, setSearch] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("newest");

    const [loading, setLoading] = useState(true);
    const [filtersLoading, setFiltersLoading] =
        useState(true);

    const [error, setError] = useState("");

    /*
    ==========================================
    LOAD BRANDS + CATEGORIES
    ==========================================
    */

    useEffect(() => {

        async function loadFilters() {

            try {

                setFiltersLoading(true);

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

            } finally {

                setFiltersLoading(false);

            }
        }

        loadFilters();

    }, []);

    /*
    ==========================================
    LOAD GADGETS
    ==========================================
    */

    async function loadGadgets(page = 1) {

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

    /*
    ==========================================
    FILTER / SORT CHANGE
    ==========================================
    */

    useEffect(() => {

        loadGadgets(1);

    }, [
        brand,
        category,
        sort,
    ]);

    /*
    ==========================================
    SEARCH
    ==========================================
    */

    function handleSearch(event) {

        event.preventDefault();

        loadGadgets(1);

    }

    /*
    ==========================================
    CLEAR FILTERS
    ==========================================
    */

    function clearFilters() {

        setSearch("");
        setBrand("");
        setCategory("");
        setSort("newest");

    }

    return (

        <main className={styles.main}>

            <h1 className={styles.title}>
                All Gadgets
            </h1>

            {/* =================================
                SEARCH
            ================================= */}

            <section className={styles.filters}>

                <form
                    className={styles.searchForm}
                    onSubmit={handleSearch}
                >

                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Search gadgets..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                    <button
                        className={styles.searchButton}
                        type="submit"
                    >
                        Search
                    </button>

                </form>

                {/* =================================
                    FILTERS
                ================================= */}

                <div className={styles.filterRow}>

                    {/* BRAND */}

                    <select
                        className={styles.select}
                        value={brand}
                        disabled={filtersLoading}
                        onChange={(event) =>
                            setBrand(
                                event.target.value
                            )
                        }
                    >

                        <option value="">
                            All Brands
                        </option>

                        {brands.map(
                            (brandItem) => (

                                <option
                                    key={brandItem.id}
                                    value={brandItem.slug}
                                >
                                    {brandItem.name}
                                </option>

                            )
                        )}

                    </select>

                    {/* CATEGORY */}

                    <select
                        className={styles.select}
                        value={category}
                        disabled={filtersLoading}
                        onChange={(event) =>
                            setCategory(
                                event.target.value
                            )
                        }
                    >

                        <option value="">
                            All Categories
                        </option>

                        {categories.map(
                            (categoryItem) => (

                                <option
                                    key={categoryItem.id}
                                    value={categoryItem.slug}
                                >
                                    {categoryItem.name}
                                </option>

                            )
                        )}

                    </select>

                    {/* SORT */}

                    <select
                        className={styles.select}
                        value={sort}
                        onChange={(event) =>
                            setSort(
                                event.target.value
                            )
                        }
                    >

                        <option value="newest">
                            Newest
                        </option>

                        <option value="oldest">
                            Oldest
                        </option>

                        <option value="name">
                            Name
                        </option>

                        <option value="rating">
                            Rating
                        </option>

                    </select>

                    <button
                        className={styles.clearButton}
                        type="button"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                </div>

            </section>

            {/* RESULT COUNT */}

            <p className={styles.resultCount}>
                {pagination.total} gadgets found
            </p>

            {/* LOADING */}

            {loading && (
                <p>
                    Loading gadgets...
                </p>
            )}

            {/* ERROR */}

            {!loading && error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}

            {/* GADGETS */}

            {!loading && !error && (

                <div className={styles.gadgetGrid}>

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

            )}

            {/* PAGINATION */}

            {!loading &&
                pagination.totalPages > 1 && (

                <div
                    className={styles.pagination}
                >

                    <button
                        disabled={
                            pagination.page <= 1
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
                            pagination.totalPages
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