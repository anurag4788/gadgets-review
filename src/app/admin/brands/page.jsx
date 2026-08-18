"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import brandService from "@/services/brandService";

import styles from "./AdminBrandsPage.module.css";

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

            <main className={styles.page}>

                <div className={styles.stateCard}>

                    <div className={styles.loader} />

                    <h1>
                        Manage Brands
                    </h1>

                    <p>
                        Loading brands...
                    </p>

                </div>

            </main>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error && !pagination) {

        return (

            <main className={styles.page}>

                <div className={styles.stateCard}>

                    <div className={styles.errorIcon}>
                        !
                    </div>

                    <h1>
                        Manage Brands
                    </h1>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadBrands}
                        className={styles.retryButton}
                    >
                        Try Again
                    </button>

                </div>

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

        <main className={styles.page}>


            {/* ==================================
                HEADER
            ================================== */}

            <header className={styles.header}>

                <div className={styles.headerContent}>

                    <div>

                        <p className={styles.eyebrow}>
                            Administration
                        </p>

                        <h1 className={styles.pageTitle}>
                            Manage Brands
                        </h1>

                        <p className={styles.pageDescription}>
                            Create, edit, search and manage
                            all gadget brands.
                        </p>

                    </div>


                    <Link
                        href="/admin/brands/create"
                        className={styles.addButton}
                    >
                        <span className={styles.addIcon}>
                            +
                        </span>

                        Add Brand
                    </Link>

                </div>

            </header>


            {/* ==================================
                SEARCH
            ================================== */}

            <section className={styles.searchSection}>

                <div className={styles.searchHeader}>

                    <div>

                        <p className={styles.sectionEyebrow}>
                            Brand Directory
                        </p>

                        <h2 className={styles.sectionTitle}>
                            Search Brands
                        </h2>

                    </div>

                    {pagination && (

                        <span className={styles.resultCount}>
                            {pagination.totalItems} brands
                        </span>

                    )}

                </div>


                <div className={styles.searchBox}>

                    <span className={styles.searchIcon}>
                        ⌕
                    </span>


                    <input
                        type="text"
                        placeholder="Search brand..."
                        value={search}
                        onChange={
                            handleSearchChange
                        }
                        className={styles.searchInput}
                    />


                    {search && (

                        <button
                            type="button"
                            onClick={() => {

                                setSearch("");
                                setPage(1);

                            }}
                            className={styles.clearButton}
                        >
                            Clear
                        </button>

                    )}

                </div>

            </section>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div className={styles.inlineError}>

                    <span>
                        !
                    </span>

                    {error}

                </div>

            )}


            {/* ==================================
                LOADING
            ================================== */}

            {loading && (

                <div className={styles.loadingBar}>

                    <div className={styles.smallLoader} />

                    <span>
                        Loading brands...
                    </span>

                </div>

            )}


            {/* ==================================
                BRAND LIST
            ================================== */}

            {!loading &&
            brands.length === 0 ? (

                <section className={styles.emptyState}>

                    <div className={styles.emptyIcon}>
                        ◇
                    </div>

                    <h2>
                        No brands found
                    </h2>

                    <p>
                        {search
                            ? "Try a different search term."
                            : "There are no brands available yet."}
                    </p>

                    {search && (

                        <button
                            type="button"
                            onClick={() => {

                                setSearch("");
                                setPage(1);

                            }}
                            className={styles.emptyButton}
                        >
                            Clear Search
                        </button>

                    )}

                </section>

            ) : (

                <section className={styles.brandSection}>

                    <div className={styles.brandGrid}>

                        {brands.map(
                            (brand) => (

                                <article
                                    key={brand.id}
                                    className={styles.brandCard}
                                >


                                    {/* LOGO */}

                                    <div className={styles.logoArea}>

                                        {brand.logo ? (

                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                width={100}
                                                height={100}
                                                className={styles.logo}
                                            />

                                        ) : (

                                            <div className={styles.noLogo}>
                                                <span>
                                                    {brand.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>

                                        )}

                                    </div>


                                    {/* BRAND INFO */}

                                    <div className={styles.brandContent}>

                                        <div className={styles.brandTop}>

                                            <h2 className={styles.brandName}>
                                                {brand.name}
                                            </h2>

                                            <span className={styles.brandStatus}>
                                                Active
                                            </span>

                                        </div>


                                        {/* DESCRIPTION */}

                                        {brand.description && (

                                            <p className={styles.description}>
                                                {
                                                    brand.description
                                                }
                                            </p>

                                        )}


                                        {/* WEBSITE */}

                                        {brand.website && (

                                            <div className={styles.website}>

                                                <span className={styles.metaLabel}>
                                                    Website
                                                </span>

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

                                            </div>

                                        )}


                                        {/* CREATED DATE */}

                                        <div className={styles.createdDate}>

                                            <span>
                                                Created
                                            </span>

                                            <strong>
                                                {new Date(
                                                    brand.createdAt
                                                ).toLocaleDateString()}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className={styles.actions}>

                                        <Link
                                            href={
                                                `/admin/brands/${brand.slug}/edit`
                                            }
                                            className={styles.editButton}
                                        >
                                            Edit
                                        </Link>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    brand.slug
                                                )
                                            }
                                            disabled={
                                                deleting ===
                                                brand.slug
                                            }
                                            className={styles.deleteButton}
                                        >

                                            {
                                                deleting ===
                                                brand.slug
                                                    ? "Deleting..."
                                                    : "Delete"
                                            }

                                        </button>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                </section>

            )}


            {/* ==================================
                PAGINATION
            ================================== */}

            {pagination && (

                <nav
                    className={styles.pagination}
                    aria-label="Brand pagination"
                >

                    <button
                        type="button"
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
                        className={styles.paginationButton}
                    >
                        ← Previous
                    </button>


                    <div className={styles.pageIndicator}>

                        <span>
                            Page
                        </span>

                        <strong>
                            {pagination.currentPage}
                        </strong>

                        <span>
                            of
                        </span>

                        <strong>
                            {pagination.totalPages}
                        </strong>

                    </div>


                    <button
                        type="button"
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
                        className={styles.paginationButton}
                    >
                        Next →
                    </button>

                </nav>

            )}

        </main>

    );

}