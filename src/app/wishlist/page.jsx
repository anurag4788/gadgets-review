"use client";

import {
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import wishlistService from "@/services/wishlistService";

import {
    useAuth,
} from "@/context/AuthContext";


export default function WishlistPage() {

    const { user } =
        useAuth();


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
    // LOAD ON USER CHANGE
    // ==========================================

    useEffect(() => {

        if (user) {

            loadWishlist();

        } else {

            setWishlist([]);

            setLoading(false);

        }

    }, [user]);


    // ==========================================
    // REMOVE FROM WISHLIST
    // ==========================================

    async function handleRemove(
        gadgetId
    ) {

        try {

            setRemovingId(
                gadgetId
            );

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

            <main>

                <h1>
                    My Wishlist ❤️
                </h1>

                <p>
                    Please login to view your
                    wishlist.
                </p>

                <Link href="/login">
                    Login
                </Link>

            </main>

        );

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main>

                <h1>
                    My Wishlist ❤️
                </h1>

                <p>
                    Loading wishlist...
                </p>

            </main>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error && wishlist.length === 0) {

        return (

            <main>

                <h1>
                    My Wishlist ❤️
                </h1>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={loadWishlist}
                >
                    Try Again
                </button>

            </main>

        );

    }


    // ==========================================
    // EMPTY WISHLIST
    // ==========================================

    if (wishlist.length === 0) {

        return (

            <main>

                <h1>
                    My Wishlist ❤️
                </h1>

                <p>
                    Your wishlist is empty.
                </p>

                <Link href="/gadgets">
                    Browse Gadgets
                </Link>

            </main>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <main>

            <h1>
                My Wishlist ❤️
            </h1>

            <p>
                {wishlist.length}{" "}
                {wishlist.length === 1
                    ? "gadget"
                    : "gadgets"
                }{" "}
                saved
            </p>


            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* ==================================
                WISHLIST GRID
            ================================== */}

            <section>

                {wishlist.map(
                    (item) => {

                        const gadget =
                            item.gadget;

                        return (

                            <article
                                key={item.id}
                            >

                                {/* IMAGE */}

                                {gadget.image && (

                                    <img
                                        src={
                                            gadget.image
                                        }
                                        alt={
                                            gadget.name
                                        }
                                    />

                                )}


                                {/* NAME */}

                                <h2>
                                    {gadget.name}
                                </h2>


                                {/* MODEL */}

                                {gadget.model && (

                                    <p>
                                        Model:{" "}
                                        {gadget.model}
                                    </p>

                                )}


                                {/* BRAND */}

                                {gadget.brand && (

                                    <p>
                                        Brand:{" "}

                                        {gadget.brand.name}

                                    </p>

                                )}


                                {/* CATEGORY */}

                                {gadget.category && (

                                    <p>
                                        Category:{" "}

                                        {
                                            gadget
                                                .category
                                                .name
                                        }

                                    </p>

                                )}


                                {/* RATING */}

                                <p>

                                    ⭐{" "}

                                    {gadget.avgRating
                                        ? Number(
                                            gadget.avgRating
                                        ).toFixed(1)
                                        : "No rating"
                                    }

                                </p>


                                {/* ACTIONS */}

                                <div>

                                    <Link
                                        href={`/gadgets/${gadget.slug}`}
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
                                    >

                                        {removingId ===
                                        gadget.id

                                            ? "Removing..."

                                            : "Remove"
                                        }

                                    </button>

                                </div>

                            </article>

                        );

                    }
                )}

            </section>

        </main>

    );

}