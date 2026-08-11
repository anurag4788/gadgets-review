"use client";

import { useState } from "react";

import reviewService from "@/services/reviewService";
import { useAuth } from "@/context/AuthContext";

export default function ReviewForm({
    gadgetId,
    onReviewCreated,
}) {

    const { user } = useAuth();

    const [title, setTitle] =
        useState("");

    const [review, setReview] =
        useState("");

    const [rating, setRating] =
        useState(5);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // SUBMIT REVIEW
    // ==========================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");


        // ==========================================
        // AUTHENTICATION CHECK
        // ==========================================

        if (!user) {

            setError(
                "Please login to write a review."
            );

            return;

        }


        // ==========================================
        // FRONTEND VALIDATION
        // ==========================================

        if (title.trim().length < 3) {

            setError(
                "Title must be at least 3 characters"
            );

            return;

        }


        if (title.trim().length > 100) {

            setError(
                "Title cannot exceed 100 characters"
            );

            return;

        }


        if (review.trim().length < 20) {

            setError(
                "Review must be at least 20 characters"
            );

            return;

        }


        if (review.trim().length > 5000) {

            setError(
                "Review cannot exceed 5000 characters"
            );

            return;

        }


        if (
            rating < 1 ||
            rating > 5
        ) {

            setError(
                "Rating must be between 1 and 5"
            );

            return;

        }


        // ==========================================
        // CREATE REVIEW
        // ==========================================

        try {

            setLoading(true);

            const response =
                await reviewService.create({

                    title:
                        title.trim(),

                    review:
                        review.trim(),

                    rating:
                        Number(rating),

                    gadgetId,

                });


            setSuccess(
                response.data.message ||
                "Review created successfully"
            );


            // ==========================================
            // CLEAR FORM
            // ==========================================

            setTitle("");

            setReview("");

            setRating(5);


            // ==========================================
            // RELOAD REVIEWS
            // ==========================================

            if (onReviewCreated) {

                await onReviewCreated();

            }

        } catch (error) {

            console.error(
                "Create Review Error:",
                error
            );


            // ==========================================
            // DUPLICATE REVIEW
            // ==========================================

            if (
                error.response?.status === 409
            ) {

                setError(
                    "You have already reviewed this gadget."
                );

                return;

            }


            // ==========================================
            // UNAUTHORIZED
            // ==========================================

            if (
                error.response?.status === 401
            ) {

                setError(
                    "Please login to write a review."
                );

                return;

            }


            // ==========================================
            // VALIDATION ERROR
            // ==========================================

            if (
                error.response?.status === 400
            ) {

                setError(
                    error.response?.data?.message ||
                    "Please check your review details."
                );

                return;

            }


            // ==========================================
            // GENERAL ERROR
            // ==========================================

            setError(
                error.response?.data?.message ||
                "Failed to create review"
            );

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <section>

            <h2>
                Write a Review
            </h2>


            {error && (

                <p>
                    {error}
                </p>

            )}


            {success && (

                <p>
                    {success}
                </p>

            )}


            {!user && (

                <p>
                    Please login to write a review.
                </p>

            )}


            <form
                onSubmit={handleSubmit}
            >

                {/* ==================================
                    TITLE
                ================================== */}

                <div>

                    <label>
                        Title
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(
                                event.target.value
                            )
                        }
                        placeholder="Review title"
                        disabled={
                            loading ||
                            !user
                        }
                    />

                </div>


                {/* ==================================
                    RATING
                ================================== */}

                <div>

                    <label>
                        Rating
                    </label>

                    <select
                        value={rating}
                        onChange={(event) =>
                            setRating(
                                Number(
                                    event.target.value
                                )
                            )
                        }
                        disabled={
                            loading ||
                            !user
                        }
                    >

                        <option value={1}>
                            1 - Poor
                        </option>

                        <option value={2}>
                            2 - Fair
                        </option>

                        <option value={3}>
                            3 - Good
                        </option>

                        <option value={4}>
                            4 - Very Good
                        </option>

                        <option value={5}>
                            5 - Excellent
                        </option>

                    </select>

                </div>


                {/* ==================================
                    REVIEW
                ================================== */}

                <div>

                    <label>
                        Review
                    </label>

                    <textarea
                        value={review}
                        onChange={(event) =>
                            setReview(
                                event.target.value
                            )
                        }
                        placeholder="Write your review..."
                        rows={6}
                        disabled={
                            loading ||
                            !user
                        }
                    />

                </div>


                {/* ==================================
                    SUBMIT
                ================================== */}

                <button
                    type="submit"
                    disabled={
                        loading ||
                        !user
                    }
                >

                    {loading
                        ? "Submitting..."
                        : "Submit Review"
                    }

                </button>

            </form>

        </section>

    );

}