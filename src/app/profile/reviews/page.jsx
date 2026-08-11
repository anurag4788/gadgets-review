"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import useAuth from "@/hooks/useAuth";
import userService from "@/services/userService";

export default function MyReviewsPage() {

    const { user, loading: authLoading } =
        useAuth();

    const [reviews, setReviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD USER REVIEWS
    // ==========================================

    useEffect(() => {

        async function loadReviews() {

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
                <p>Loading...</p>
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
                    : "reviews"}
                .
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

                            <article
                                key={review.id}
                            >

                                <h2>
                                    {review.title}
                                </h2>


                                <p>
                                    Gadget:{" "}
                                    <Link
                                        href={`/gadgets/${review.gadget.slug}`}
                                    >
                                        {review.gadget.name}
                                    </Link>
                                </p>


                                <p>
                                    Brand:{" "}
                                    {review.gadget.brand.name}
                                </p>


                                <p>
                                    ⭐{" "}
                                    {review.rating}
                                    /5
                                </p>


                                <p>
                                    {review.review}
                                </p>


                                <p>
                                    👍{" "}
                                    {review._count.likes}
                                    {" "}
                                    {review._count.likes === 1
                                        ? "like"
                                        : "likes"}
                                </p>


                                <p>
                                    Reviewed on{" "}
                                    {new Date(
                                        review.createdAt
                                    ).toLocaleDateString()}
                                </p>

                            </article>

                        )
                    )}

                </section>

            )}

        </main>

    );

}