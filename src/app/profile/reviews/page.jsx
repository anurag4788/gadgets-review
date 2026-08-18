"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import useAuth from "@/hooks/useAuth";
import userService from "@/services/userService";
import ReviewItem from "@/components/reviews/ReviewItem";

export default function MyReviewsPage() {

    const {
        user,
        loading: authLoading,
    } = useAuth();

    const [reviews, setReviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD USER REVIEWS
    // ==========================================

    async function loadReviews() {

        if (!user?.id) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response =
                await userService.getReviews(
                    user.id
                );

            setReviews(
                response.data.data
            );

        } catch (error) {

            console.error(
                "Get My Reviews Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load your reviews."
            );

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // LOAD REVIEWS WHEN USER IS AVAILABLE
    // ==========================================

    useEffect(() => {

        if (user?.id) {

            loadReviews();

        } else if (!authLoading) {

            setLoading(false);

        }

    }, [user?.id, authLoading]);


    // ==========================================
    // AUTH LOADING
    // ==========================================

    if (authLoading) {

        return (
            <main>

                <p>
                    Loading...
                </p>

            </main>
        );

    }


    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!user) {

        return (
            <main>

                <h1>
                    My Reviews
                </h1>

                <p>
                    Please login to view your reviews.
                </p>

                <Link href="/login">
                    Login
                </Link>

            </main>
        );

    }


    // ==========================================
    // REVIEWS LOADING
    // ==========================================

    if (loading) {

        return (
            <main>

                <h1>
                    My Reviews
                </h1>

                <p>
                    Loading your reviews...
                </p>

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
                    My Reviews
                </h1>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={loadReviews}
                >
                    Try Again
                </button>

            </main>
        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <main>

            <Link href="/profile">
                ← Back to Profile
            </Link>


            <h1>
                My Reviews
            </h1>


            <p>
                You have written{" "}
                {reviews.length}{" "}
                {reviews.length === 1
                    ? "review"
                    : "reviews"}.
            </p>


            {/* ==================================
                NO REVIEWS
            ================================== */}

            {reviews.length === 0 && (

                <section>

                    <p>
                        You haven't written
                        any reviews yet.
                    </p>

                    <Link href="/gadgets">
                        Browse Gadgets
                    </Link>

                </section>

            )}


            {/* ==================================
                REVIEWS
            ================================== */}

            {reviews.length > 0 && (

                <section>

                    {reviews.map(
                        (review) => (

                            <ReviewItem
                                key={review.id}

                                review={{
                                    ...review,

                                    user: {
                                        id: user.id,
                                        name: user.name,
                                    },

                                    isLiked:
                                        review.isLiked ??
                                        false,
                                }}

                                onReviewUpdated={
                                    loadReviews
                                }

                                onReviewDeleted={
                                    loadReviews
                                }
                            />

                        )
                    )}

                </section>

            )}

        </main>

    );

}