"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "next/navigation";

import Link from "next/link";

import gadgetService from "@/services/gadgetService";
import reviewService from "@/services/reviewService";
import wishlistService from "@/services/wishlistService";

import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewItem from "@/components/reviews/ReviewItem";

import {
    useAuth,
} from "@/context/AuthContext";

import styles from "./page.module.css";


export default function GadgetDetailPage() {

    const params =
        useParams();

    const slug =
        params.slug;

    const { user } =
        useAuth();


    // ==========================================
    // GADGET STATE
    // ==========================================

    const [gadget, setGadget] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // REVIEW STATE
    // ==========================================

    const [reviews, setReviews] =
        useState([]);

    const [reviewsLoading, setReviewsLoading] =
        useState(false);

    const [reviewsError, setReviewsError] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pagination, setPagination] =
        useState(null);


    // ==========================================
    // WISHLIST STATE
    // ==========================================

    const [isWishlisted, setIsWishlisted] =
        useState(false);

    const [wishlistLoading, setWishlistLoading] =
        useState(false);

    const [wishlistError, setWishlistError] =
        useState("");


    // ==========================================
    // LOAD GADGET
    // ==========================================

    async function loadGadget() {

        try {

            setLoading(true);
            setError("");

            const response =
                await gadgetService.getBySlug(
                    slug
                );

            setGadget(
                response.data.data
            );

        } catch (error) {

            console.error(
                "Get Gadget Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load gadget"
            );

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // LOAD REVIEWS
    // ==========================================

    async function loadReviews() {

        if (!gadget?.id) {
            return;
        }

        try {

            setReviewsLoading(true);
            setReviewsError("");

            const response =
                await reviewService.getAll({

                    gadgetId:
                        gadget.id,

                    page,

                    limit: 5,

                });

            const data =
                response.data.data;

            setReviews(
                data.reviews || []
            );

            setPagination(
                data.pagination || null
            );

        } catch (error) {

            console.error(
                "Get Reviews Error:",
                error
            );

            setReviewsError(
                error.response?.data?.message ||
                "Failed to load reviews"
            );

        } finally {

            setReviewsLoading(false);

        }

    }


    // ==========================================
    // LOAD WISHLIST STATUS
    // ==========================================

    async function loadWishlistStatus() {

        if (
            !user ||
            !gadget?.id
        ) {

            setIsWishlisted(false);

            return;

        }

        try {

            const response =
                await wishlistService.getAll();

            const wishlist =
                response.data.data || [];

            const exists =
                wishlist.some(
                    (item) =>
                        item.gadget?.id ===
                        gadget.id
                );

            setIsWishlisted(
                exists
            );

        } catch (error) {

            if (
                error.response?.status !== 401
            ) {

                console.error(
                    "Get Wishlist Error:",
                    error
                );

            }

        }

    }


    // ==========================================
    // LOAD GADGET ON SLUG CHANGE
    // ==========================================

    useEffect(() => {

        if (slug) {

            loadGadget();

        }

    }, [slug]);


    // ==========================================
    // LOAD REVIEWS
    // ==========================================

    useEffect(() => {

        if (gadget?.id) {

            loadReviews();

        }

    }, [
        gadget?.id,
        page,
    ]);


    // ==========================================
    // LOAD WISHLIST STATUS
    // ==========================================

    useEffect(() => {

        if (
            gadget?.id &&
            user
        ) {

            loadWishlistStatus();

        } else {

            setIsWishlisted(false);

        }

    }, [
        gadget?.id,
        user,
    ]);


    // ==========================================
    // WISHLIST TOGGLE
    // ==========================================

    async function handleWishlist() {

        if (!user) {

            setWishlistError(
                "Please login to use your wishlist."
            );

            return;

        }

        if (!gadget?.id) {
            return;
        }

        try {

            setWishlistLoading(true);

            setWishlistError("");


            // ==========================================
            // REMOVE
            // ==========================================

            if (isWishlisted) {

                await wishlistService.remove(
                    gadget.id
                );

                setIsWishlisted(
                    false
                );

                return;

            }


            // ==========================================
            // ADD
            // ==========================================

            await wishlistService.add(
                gadget.id
            );

            setIsWishlisted(
                true
            );

        } catch (error) {

            console.error(
                "Wishlist Error:",
                error
            );


            if (
                error.response?.status === 401
            ) {

                setWishlistError(
                    "Please login to use your wishlist."
                );

                return;

            }


            if (
                error.response?.status === 409
            ) {

                setIsWishlisted(
                    true
                );

                return;

            }


            setWishlistError(
                error.response?.data?.message ||
                "Failed to update wishlist."
            );

        } finally {

            setWishlistLoading(
                false
            );

        }

    }


    // ==========================================
    // REVIEW CREATED
    // ==========================================

    async function handleReviewCreated() {

        setPage(1);

        await loadReviews();

        await loadGadget();

    }


    // ==========================================
    // REVIEW UPDATED
    // ==========================================

    async function handleReviewUpdated() {

        await loadReviews();

        await loadGadget();

    }


    // ==========================================
    // REVIEW DELETED
    // ==========================================

    async function handleReviewDeleted() {

        await loadReviews();

        await loadGadget();

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main>

                <h1>
                    Loading gadget...
                </h1>

            </main>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <main>

                <h1>
                    Gadget
                </h1>

                <p>
                    {error}
                </p>

                <Link href="/gadgets">
                    Back to Gadgets
                </Link>

            </main>

        );

    }


    // ==========================================
    // GADGET NOT FOUND
    // ==========================================

    if (!gadget) {

        return (

            <main>

                <h1>
                    Gadget not found
                </h1>

                <Link href="/gadgets">
                    Back to Gadgets
                </Link>

            </main>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <main
            className={styles.container}
        >

            {/* ==================================
                BACK
            ================================== */}

            <Link
                href="/gadgets"
            >
                ← Back to Gadgets
            </Link>


            {/* ==================================
                GADGET DETAILS
            ================================== */}

            <section
                className={styles.gadgetSection}
            >

                {/* IMAGE */}

                {gadget.image && (

                    <div>

                        <img
                            src={gadget.image}
                            alt={gadget.name}
                        />

                    </div>

                )}


                {/* INFORMATION */}

                <div>

                    <h1>
                        {gadget.name}
                    </h1>


                    {gadget.model && (

                        <p>
                            Model: {gadget.model}
                        </p>

                    )}


                    {gadget.brand && (

                        <p>

                            Brand:{" "}

                            <Link
                                href={`/brands/${gadget.brand.slug}`}
                            >
                                {gadget.brand.name}
                            </Link>

                        </p>

                    )}


                    {gadget.category && (

                        <p>

                            Category:{" "}

                            <Link
                                href={`/categories/${gadget.category.slug}`}
                            >
                                {gadget.category.name}
                            </Link>

                        </p>

                    )}


                    {gadget.releaseYear && (

                        <p>
                            Released:{" "}
                            {gadget.releaseYear}
                        </p>

                    )}


                    {/* ==================================
                        RATING
                    ================================== */}

                    <p>

                        ⭐{" "}

                        {gadget.avgRating
                            ? Number(
                                gadget.avgRating
                            ).toFixed(1)
                            : "No rating"
                        }

                    </p>


                    {/* ==================================
                        DESCRIPTION
                    ================================== */}

                    {gadget.description && (

                        <p>
                            {gadget.description}
                        </p>

                    )}


                    {/* ==================================
                        WISHLIST
                    ================================== */}

                    <div>

                        <button
                            type="button"
                            onClick={
                                handleWishlist
                            }
                            disabled={
                                wishlistLoading
                            }
                        >

                            {wishlistLoading

                                ? "Updating..."

                                : isWishlisted

                                    ? "❤️ Remove from Wishlist"

                                    : "🤍 Add to Wishlist"

                            }

                        </button>


                        {wishlistError && (

                            <p>
                                {wishlistError}
                            </p>

                        )}

                    </div>

                </div>

            </section>


            {/* ==================================
                REVIEWS
            ================================== */}

            <section>

                <h2>
                    Reviews
                </h2>


                {/* ==================================
                    REVIEW FORM
                ================================== */}

                <ReviewForm
                    gadgetId={
                        gadget.id
                    }
                    onReviewCreated={
                        handleReviewCreated
                    }
                />


                {/* ==================================
                    REVIEW ERROR
                ================================== */}

                {reviewsError && (

                    <p>
                        {reviewsError}
                    </p>

                )}


                {/* ==================================
                    REVIEW LOADING
                ================================== */}

                {reviewsLoading && (

                    <p>
                        Loading reviews...
                    </p>

                )}


                {/* ==================================
                    REVIEWS LIST
                ================================== */}

                {!reviewsLoading &&
                    reviews.length === 0 && (

                        <p>
                            No reviews yet.
                            Be the first to
                            review this gadget.
                        </p>

                    )
                }


                {!reviewsLoading &&
                    reviews.length > 0 && (

                        <div>

                            {reviews.map(
                                (review) => (

                                    <ReviewItem
                                        key={
                                            review.id
                                        }
                                        review={
                                            review
                                        }
                                        onReviewUpdated={
                                            handleReviewUpdated
                                        }
                                        onReviewDeleted={
                                            handleReviewDeleted
                                        }
                                    />

                                )
                            )}

                        </div>

                    )
                }


                {/* ==================================
                    PAGINATION
                ================================== */}

                {pagination &&
                    pagination.totalPages > 1 && (

                        <div>

                            <button
                                type="button"
                                disabled={
                                    !pagination.hasPreviousPage ||
                                    reviewsLoading
                                }
                                onClick={() =>
                                    setPage(
                                        (prev) =>
                                            prev - 1
                                    )
                                }
                            >
                                Previous
                            </button>


                            <span>

                                {" "}

                                Page{" "}
                                {pagination.currentPage}
                                {" "}
                                of{" "}
                                {pagination.totalPages}

                                {" "}

                            </span>


                            <button
                                type="button"
                                disabled={
                                    !pagination.hasNextPage ||
                                    reviewsLoading
                                }
                                onClick={() =>
                                    setPage(
                                        (prev) =>
                                            prev + 1
                                    )
                                }
                            >
                                Next
                            </button>

                        </div>

                    )
                }

            </section>

        </main>

    );

}