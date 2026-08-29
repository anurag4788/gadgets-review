"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import useAuth from "@/hooks/useAuth";
import userService from "@/services/userService";
import ReviewItem from "@/components/reviews/ReviewItem";

import styles from "./page.module.css";

export default function MyReviewsPage() {

    const {
        user,
        loading: authLoading,
    } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


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
                await userService.getReviews(user.id);

            setReviews(
                response.data.data || []
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
    // LOAD REVIEWS
    // ==========================================

    useEffect(() => {

        if (!authLoading && user?.id) {
            loadReviews();
        }

        if (!authLoading && !user) {
            setLoading(false);
        }

    }, [authLoading, user?.id]);


    // ==========================================
    // AUTH LOADING
    // ==========================================

    if (authLoading) {

        return (
            <main className={styles.pageState}>

                <div className={styles.loader} />

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
            <main className={styles.pageState}>

                <div className={styles.stateCard}>

                    <h1>
                        My Reviews
                    </h1>

                    <p>
                        Please login to view your reviews.
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
    // REVIEWS LOADING
    // ==========================================

    if (loading) {

        return (
            <main className={styles.pageState}>

                <div className={styles.loader} />

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
            <main className={styles.pageState}>

                <div className={styles.stateCard}>

                    <h1>
                        My Reviews
                    </h1>

                    <p className={styles.error}>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadReviews}
                        className={styles.primaryButton}
                    >
                        Try Again
                    </button>

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

            <div className={styles.header}>

                <Link
                    href="/profile"
                    className={styles.backLink}
                >
                    ← Back to Profile
                </Link>

                <div>

                    <p className={styles.eyebrow}>
                        Your activity
                    </p>

                    <h1 className={styles.title}>
                        My Reviews
                    </h1>

                    <p className={styles.subtitle}>

                        You have written{" "}

                        <strong>
                            {reviews.length}
                        </strong>{" "}

                        {reviews.length === 1
                            ? "review"
                            : "reviews"}.

                    </p>

                </div>

            </div>


            {/* ==================================
                EMPTY STATE
            ================================== */}

            {reviews.length === 0 && (

                <section className={styles.emptyState}>

                    <div className={styles.emptyIcon}>
                        ★
                    </div>

                    <h2>
                        No reviews yet
                    </h2>

                    <p>
                        You haven't written any reviews yet.
                        Find a gadget and share your experience.
                    </p>

                    <Link
                        href="/gadgets"
                        className={styles.primaryButton}
                    >
                        Browse Gadgets
                    </Link>

                </section>

            )}


            {/* ==================================
                REVIEWS
            ================================== */}

            {reviews.length > 0 && (

                <section className={styles.reviewsList}>

                    {reviews.map((review) => (

                        <article
                            key={review.id}
                            className={styles.reviewCard}
                        >

                            <div className={styles.reviewContent}>

                                <ReviewItem
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

                            </div>

                        </article>

                    ))}

                </section>

            )}

        </main>

    );

}