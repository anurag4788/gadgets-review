"use client";

import { useState } from "react";

import reviewService from "@/services/reviewService";

export default function ReviewForm({
    gadgetId,
    onReviewCreated,
}) {

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

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");

        // Frontend validation

        if (title.trim().length < 3) {

            setError(
                "Title must be at least 3 characters"
            );

            return;
        }

        if (review.trim().length < 20) {

            setError(
                "Review must be at least 20 characters"
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

        try {

            setLoading(true);

            const response =
                await reviewService.create({

                    title: title.trim(),

                    review: review.trim(),

                    rating: Number(rating),

                    gadgetId,

                });

            setSuccess(
                response.data.message ||
                "Review created successfully"
            );

            // Clear form

            setTitle("");

            setReview("");

            setRating(5);

            // Tell parent to reload reviews

            if (onReviewCreated) {

                await onReviewCreated();

            }

        } catch (error) {

            console.error(
                "Create Review Error:",
                error
            );

            const message =
                error.response?.data?.message;

            setError(
                message ||
                "Failed to create review"
            );

        } finally {

            setLoading(false);

        }

    }

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

            <form
                onSubmit={handleSubmit}
            >

                {/* Title */}

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
                        disabled={loading}
                    />

                </div>


                {/* Rating */}

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
                        disabled={loading}
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


                {/* Review */}

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
                        disabled={loading}
                    />

                </div>


                {/* Submit */}

                <button
                    type="submit"
                    disabled={loading}
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