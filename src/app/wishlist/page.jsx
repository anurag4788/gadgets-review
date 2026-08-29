"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import wishlistService from "@/services/wishlistService";

import { useAuth } from "@/context/AuthContext";

import styles from "./page.module.css";


export default function WishlistPage() {

    const { user } = useAuth();


    // ==========================================
    // STATE
    // ==========================================

    const [wishlist, setWishlist] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [removingId, setRemovingId] =
        useState(null);


    // ==========================================
    // LOAD WISHLIST
    // ==========================================

    async function loadWishlist() {

        if (!user) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response =
                await wishlistService.getAll();

            setWishlist(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Get Wishlist Error:",
                error
            );

            if (
                error.response?.status === 401
            ) {

                setError(
                    "Please login to view your wishlist."
                );

                return;

            }

            setError(
                error.response?.data?.message ||
                "Failed to load wishlist."
            );

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // LOAD WHEN USER CHANGES
    // ==========================================

    useEffect(() => {

        if (user) {

            loadWishlist();

        } else {

            setWishlist([]);
            setLoading(false);

        }

    }, [user?.id]);


    // ==========================================
    // REMOVE FROM WISHLIST
    // ==========================================

    async function handleRemove(gadgetId) {

        try {

            setRemovingId(gadgetId);
            setError("");

            await wishlistService.remove(
                gadgetId
            );


            // Remove immediately
            // from local state

            setWishlist(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item.gadget?.id !==
                            gadgetId
                    )
            );

        } catch (error) {

            console.error(
                "Remove Wishlist Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to remove gadget."
            );

        } finally {

            setRemovingId(null);

        }

    }


    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!user) {

        return (

            <main className={styles.pageState}>

                <div className={styles.stateCard}>

                    <div className={styles.stateIcon}>
                        ❤️
                    </div>

                    <h1>
                        My Wishlist
                    </h1>

                    <p>
                        Please login to view your
                        wishlist.
                    </p>

                    <Link
                        href="/login"
                        className={styles.primaryButton}
                    >
                        Login
                    </Link>

                </div>

            </main>

        );

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main className={styles.pageState}>

                <div className={styles.loader} />

                <p>
                    Loading your wishlist...
                </p>

            </main>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (
        error &&
        wishlist.length === 0
    ) {

        return (

            <main className={styles.pageState}>

                <div className={styles.stateCard}>

                    <div className={styles.stateIcon}>
                        ⚠️
                    </div>

                    <h1>
                        My Wishlist
                    </h1>

                    <p className={styles.error}>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadWishlist}
                        className={styles.primaryButton}
                    >
                        Try Again
                    </button>

                </div>

            </main>

        );

    }


    // ==========================================
    // EMPTY WISHLIST
    // ==========================================

    if (wishlist.length === 0) {

        return (

            <main className={styles.pageState}>

                <div className={styles.stateCard}>

                    <div className={styles.stateIcon}>
                        ❤️
                    </div>

                    <h1>
                        Your Wishlist is Empty
                    </h1>

                    <p>
                        Save your favorite gadgets
                        here so you can easily find
                        them later.
                    </p>

                    <Link
                        href="/gadgets"
                        className={styles.primaryButton}
                    >
                        Browse Gadgets
                    </Link>

                </div>

            </main>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <main className={styles.main}>

            {/* ==================================
                HEADER
            ================================== */}

            <header className={styles.header}>

                <Link
                    href="/gadgets"
                    className={styles.backLink}
                >
                    ← Back to Gadgets
                </Link>

                <div>

                    <p className={styles.eyebrow}>
                        Your saved gadgets
                    </p>

                    <h1 className={styles.title}>
                        My Wishlist ❤️
                    </h1>

                    <p className={styles.subtitle}>

                        {wishlist.length}{" "}

                        {wishlist.length === 1
                            ? "gadget"
                            : "gadgets"}

                        {" "}saved

                    </p>

                </div>

            </header>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div className={styles.errorBanner}>
                    {error}
                </div>

            )}


            {/* ==================================
                WISHLIST
            ================================== */}

            <section className={styles.wishlistList}>

                {wishlist.map((item) => {

                    const gadget =
                        item.gadget;

                    if (!gadget) {
                        return null;
                    }


                    return (

                        <article
                            key={item.id}
                            className={styles.wishlistCard}
                        >

                            {/* IMAGE */}

                            <div
                                className={
                                    styles.imageWrapper
                                }
                            >

                                {gadget.image ? (

                                    <img
                                        src={gadget.image}
                                        alt={gadget.name}
                                        className={
                                            styles.image
                                        }
                                    />

                                ) : (

                                    <div
                                        className={
                                            styles.noImage
                                        }
                                    >
                                        No Image
                                    </div>

                                )}

                            </div>


                            {/* INFORMATION */}

                            <div className={styles.info}>

                                {gadget.brand && (

                                    <p
                                        className={
                                            styles.brand
                                        }
                                    >
                                        {gadget.brand.name}
                                    </p>

                                )}

                                <h2
                                    className={
                                        styles.name
                                    }
                                >
                                    {gadget.name}
                                </h2>


                                <div
                                    className={
                                        styles.details
                                    }
                                >

                                    {gadget.model && (

                                        <span>
                                            <strong>
                                                Model:
                                            </strong>{" "}
                                            {gadget.model}
                                        </span>

                                    )}

                                    {gadget.category && (

                                        <span>
                                            <strong>
                                                Category:
                                            </strong>{" "}
                                            {
                                                gadget
                                                    .category
                                                    .name
                                            }
                                        </span>

                                    )}

                                    {gadget.releaseYear && (

                                        <span>
                                            <strong>
                                                Released:
                                            </strong>{" "}
                                            {
                                                gadget
                                                    .releaseYear
                                            }
                                        </span>

                                    )}

                                </div>


                                {/* RATING */}

                                <div
                                    className={
                                        styles.rating
                                    }
                                >

                                    <span>
                                        ⭐
                                    </span>

                                    <strong>
                                        {gadget.avgRating
                                            ? Number(
                                                gadget.avgRating
                                            ).toFixed(1)
                                            : "No rating"}
                                    </strong>

                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div
                                className={
                                    styles.actions
                                }
                            >

                                <Link
                                    href={`/gadgets/${gadget.slug}`}
                                    className={
                                        styles.viewButton
                                    }
                                >
                                    View Gadget
                                </Link>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemove(
                                            gadget.id
                                        )
                                    }
                                    disabled={
                                        removingId ===
                                        gadget.id
                                    }
                                    className={
                                        styles.removeButton
                                    }
                                >

                                    {removingId ===
                                    gadget.id
                                        ? "Removing..."
                                        : "Remove"}

                                </button>

                            </div>

                        </article>

                    );

                })}

            </section>

        </main>

    );

}