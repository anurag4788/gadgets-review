"use client";

import { useEffect, useState } from "react";

import reviewService from "@/services/reviewService";

export default function AdminReviewsPage() {

    const [reviews, setReviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // Search typed by the user
    const [searchInput, setSearchInput] =
        useState("");

    // Search actually sent to API
    const [search, setSearch] =
        useState("");

    const [rating, setRating] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [deleting, setDeleting] =
        useState(null);

    const [pagination, setPagination] =
        useState({
            currentPage: 1,
            limit: 10,
            totalReviews: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
        });


    // ==========================================
    // DEBOUNCE SEARCH
    // ==========================================

    useEffect(() => {

        const timer =
            setTimeout(() => {

                setSearch(
                    searchInput.trim()
                );

                setPage(1);

            }, 500);


        return () => {

            clearTimeout(timer);

        };

    }, [searchInput]);


    // ==========================================
    // LOAD REVIEWS
    // ==========================================

    async function loadReviews() {

        try {

            setLoading(true);
            setError("");

            const response =
                await reviewService.getAdminAll({

                    page,

                    limit: 10,

                    search,

                    ...(rating && {
                        rating: Number(rating),
                    }),

                });


            const data =
                response.data.data;


            setReviews(
                data.reviews || []
            );


            setPagination(
                data.pagination
            );

        } catch (error) {

            console.error(
                "Admin Reviews Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load reviews."
            );

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // FETCH REVIEWS
    // ==========================================

    useEffect(() => {

        loadReviews();

    }, [page, search, rating]);


    // ==========================================
    // RATING FILTER
    // ==========================================

    function handleRatingChange(event) {

        setRating(
            event.target.value
        );

        setPage(1);

    }


    // ==========================================
    // DELETE REVIEW
    // ==========================================

    async function handleDelete(id) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this review?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeleting(id);

            setError("");


            await reviewService.adminDelete(
                id
            );


            setReviews(
                (previous) =>
                    previous.filter(
                        (review) =>
                            review.id !== id
                    )
            );


            // If the last review on the page
            // was deleted, reload the page.
            if (
                reviews.length === 1 &&
                page > 1
            ) {

                setPage(
                    (previous) =>
                        previous - 1
                );

            } else {

                setPagination(
                    (previous) => ({

                        ...previous,

                        totalReviews:
                            Math.max(
                                previous.totalReviews - 1,
                                0
                            ),

                    })
                );

            }

        } catch (error) {

            console.error(
                "Admin Delete Review Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete review."
            );

        } finally {

            setDeleting(null);

        }

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading && reviews.length === 0) {

    return (

        <main>

            <h1>
                Manage Reviews
            </h1>

            <p>
                Loading reviews...
            </p>

        </main>

    );

}


    // ==========================================
    // ERROR
    // ==========================================

    if (
        error &&
        reviews.length === 0
    ) {

        return (

            <main>

                <h1>
                    Manage Reviews
                </h1>

                <p>
                    {error}
                </p>

                <button
                    onClick={loadReviews}
                >
                    Try Again
                </button>

            </main>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <main>

            {/* ==================================
                HEADER
            ================================== */}

            <div>

                <h1>
                    Manage Reviews
                </h1>

            </div>


            {/* ==================================
                FILTERS
            ================================== */}

            <div>

                {/* SEARCH */}

                <input
                    type="text"
                    value={searchInput}
                    onChange={(event) =>
                        setSearchInput(
                            event.target.value
                        )
                    }
                    placeholder="Search reviews, users, gadgets..."
                />


                {/* RATING */}

                <select
                    value={rating}
                    onChange={
                        handleRatingChange
                    }
                >

                    <option value="">
                        All Ratings
                    </option>

                    <option value="5">
                        5 Stars
                    </option>

                    <option value="4">
                        4 Stars
                    </option>

                    <option value="3">
                        3 Stars
                    </option>

                    <option value="2">
                        2 Stars
                    </option>

                    <option value="1">
                        1 Star
                    </option>

                </select>

            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* ==================================
                TOTAL REVIEWS
            ================================== */}

            <p>

                Total Reviews:{" "}

                {pagination.totalReviews}

            </p>


            {/* ==================================
                REVIEWS
            ================================== */}

            {reviews.length === 0 ? (

                <p>
                    No reviews found.
                </p>

            ) : (

                <div>

                    {reviews.map(
                        (review) => (

                            <article
                                key={review.id}
                            >

                                {/* TITLE */}

                                <h2>
                                    {review.title}
                                </h2>


                                {/* RATING */}

                                <p>
                                    ⭐{" "}
                                    {review.rating}
                                </p>


                                {/* REVIEW */}

                                <p>
                                    {review.review}
                                </p>


                                {/* USER */}

                                <p>

                                    User:{" "}

                                    {review.user.name}

                                </p>


                                <p>

                                    Email:{" "}

                                    {review.user.email}

                                </p>


                                {/* GADGET */}

                                <p>

                                    Gadget:{" "}

                                    {review.gadget.name}

                                </p>


                                {/* LIKES */}

                                <p>

                                    Likes:{" "}

                                    {review._count.likes}

                                </p>


                                {/* DATE */}

                                <p>

                                    Created:{" "}

                                    {new Date(
                                        review.createdAt
                                    ).toLocaleDateString()}

                                </p>


                                {/* DELETE */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(
                                            review.id
                                        )
                                    }
                                    disabled={
                                        deleting ===
                                        review.id
                                    }
                                >

                                    {deleting ===
                                    review.id
                                        ? "Deleting..."
                                        : "Delete Review"}

                                </button>

                            </article>

                        )
                    )}

                </div>

            )}


            {/* ==================================
                PAGINATION
            ================================== */}

            {pagination.totalPages > 1 && (

                <div>

                    <button
                        type="button"
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

                        {" "}

                        Page{" "}

                        {pagination.currentPage}

                        {" "}of{" "}

                        {pagination.totalPages}

                        {" "}

                    </span>


                    <button
                        type="button"
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