"use client";

import { useEffect, useState } from "react";

import gadgetService from "@/services/gadgetService";
import GadgetCard from "@/components/gadgets/GadgetCard";

import styles from "./page.module.css";

export default function GadgetsPage() {

    const [gadgets, setGadgets] = useState([]);

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
    const [error, setError] = useState("");

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

            setGadgets(data.gadgets);
            setPagination(data.pagination);

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

    }, [brand, category, sort]);

    function handleSearch(event) {

        event.preventDefault();

        loadGadgets(1);
    }

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

            {/* Search and Filters */}

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
                            setSearch(event.target.value)
                        }
                    />

                    <button
                        className={styles.searchButton}
                        type="submit"
                    >
                        Search
                    </button>

                </form>

                <div className={styles.filterRow}>

                    <select
                        className={styles.select}
                        value={brand}
                        onChange={(event) =>
                            setBrand(event.target.value)
                        }
                    >
                        <option value="">
                            All Brands
                        </option>

                        <option value="apple">
                            Apple
                        </option>

                        <option value="dell">
                            Dell
                        </option>

                        <option value="lenovo">
                            Lenovo
                        </option>

                        <option value="oneplus">
                            OnePlus
                        </option>

                    </select>

                    <select
                        className={styles.select}
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                    >
                        <option value="">
                            All Categories
                        </option>

                        <option value="smartphones">
                            Smartphones
                        </option>

                        <option value="laptops">
                            Laptops
                        </option>

                    </select>

                    <select
                        className={styles.select}
                        value={sort}
                        onChange={(event) =>
                            setSort(event.target.value)
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

            <p className={styles.resultCount}>
                {pagination.total} gadgets found
            </p>

            {loading && (
                <p>Loading gadgets...</p>
            )}

            {!loading && error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}

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

            {!loading &&
                pagination.totalPages > 1 && (

                <div className={styles.pagination}>

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