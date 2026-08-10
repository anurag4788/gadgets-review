"use client";

import { useState } from "react";

import reviewService from "@/services/reviewService";
import { useAuth } from "@/context/AuthContext";

export default function ReviewItem({
    review,
    onReviewUpdated,
    onReviewDeleted,
}) {

    const { user } = useAuth();

    const [editing, setEditing] =
        useState(false);

    const [title, setTitle] =
        useState(review.title);

    const [reviewText, setReviewText] =
        useState(review.review);

    const [rating, setRating] =
        useState(review.rating);

    const [isLiked, setIsLiked] =
        useState(review.isLiked);

    const [likeCount, setLikeCount] =
        useState(review._count.likes);

    const [loading, setLoading] =
        useState(false);

    const [likeLoading, setLikeLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const isOwner =
        user?.id === review.user.id;


    // ==========================================
    // UPDATE REVIEW
    // ==========================================

    async function handleUpdate(event) {

        event.preventDefault();

        setError("");

        if (title.trim().length < 3) {

            setError(
                "Title must be at least 3 characters"
            );

            return;

        }

        if (reviewText.trim().length < 20) {

            setError(
                "Review must be at least 20 characters"
            );

            return;

        }

        try {

            setLoading(true);

            await reviewService.update(
                review.id,
                {
                    title: title.trim(),
                    review: reviewText.trim(),
                    rating: Number(rating),
                }
            );

            setEditing(false);

            if (onReviewUpdated) {

                await onReviewUpdated();

            }

        } catch (error) {

            console.error(
                "Update Review Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update review"
            );

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // DELETE REVIEW
    // ==========================================

    async function handleDelete() {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this review?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setLoading(true);

            setError("");

            await reviewService.delete(
                review.id
            );

            if (onReviewDeleted) {

                await onReviewDeleted();

            }

        } catch (error) {

            console.error(
                "Delete Review Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete review"
            );

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // LIKE / UNLIKE
    // ==========================================

    async function handleLike() {

        if (!user) {

            setError(
                "Please login to like a review."
            );

            return;

        }

        try {

            setLikeLoading(true);

            setError("");

            let response;

            if (isLiked) {

                response =
                    await reviewService.unlike(
                        review.id
                    );

            } else {

                response =
                    await reviewService.like(
                        review.id
                    );

            }

            setLikeCount(
                response.data.data.likeCount
            );

            setIsLiked(
                !isLiked
            );

        } catch (error) {

            console.error(
                "Like Review Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update like"
            );

        } finally {

            setLikeLoading(false);

        }

    }


    // ==========================================
    // EDIT MODE
    // ==========================================

    if (editing) {

        return (

            <article>

                <h3>
                    Edit Review
                </h3>


                {error && (
                    <p>
                        {error}
                    </p>
                )}


                <form
                    onSubmit={handleUpdate}
                >

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
                            disabled={loading}
                        />

                    </div>


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


                    <div>

                        <label>
                            Review
                        </label>

                        <textarea
                            value={reviewText}
                            onChange={(event) =>
                                setReviewText(
                                    event.target.value
                                )
                            }
                            rows={6}
                            disabled={loading}
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : "Save Changes"
                        }
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            setEditing(false)
                        }
                        disabled={loading}
                    >
                        Cancel
                    </button>

                </form>

            </article>

        );

    }


    // ==========================================
    // NORMAL REVIEW
    // ==========================================

    return (

        <article>

            <h3>
                {review.title}
            </h3>


            <p>
                ⭐ {review.rating}
            </p>


            <p>
                {review.review}
            </p>


            <p>
                By {review.user.name}
            </p>


            {/* ==================================
                LIKE BUTTON
            ================================== */}

            <div>

                <button
                    type="button"
                    onClick={handleLike}
                    disabled={likeLoading}
                >
                    {likeLoading
                        ? "Loading..."
                        : isLiked
                            ? "❤️ Unlike"
                            : "🤍 Like"
                    }
                </button>


                <span>
                    {" "}
                    {likeCount}
                </span>

            </div>


            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* ==================================
                OWNER ACTIONS
            ================================== */}

            {isOwner && (

                <div>

                    <button
                        type="button"
                        onClick={() =>
                            setEditing(true)
                        }
                        disabled={
                            loading ||
                            likeLoading
                        }
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={
                            loading ||
                            likeLoading
                        }
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete"
                        }
                    </button>

                </div>

            )}

        </article>

    );

}