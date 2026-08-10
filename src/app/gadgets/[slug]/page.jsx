"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import gadgetService from "@/services/gadgetService";
import reviewService from "@/services/reviewService";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewItem from "@/components/reviews/ReviewItem";

import styles from "./page.module.css";

export default function GadgetDetailPage() {

    const params = useParams();

    const slug = params.slug;

    const [gadget, setGadget] =
        useState(null);

    const [reviews, setReviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [reviewsLoading, setReviewsLoading] =
        useState(true);

    const [error, setError] =
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

            if (
                error.response?.status === 404
            ) {

                setError(
                    "Gadget not found."
                );

            } else {

                setError(
                    "Failed to load gadget."
                );

            }

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

            const response =
                await reviewService.getAll({

                    gadgetId:
                        gadget.id,

                    page: 1,

                    limit: 10,

                });

            setReviews(
                response.data.data.reviews
            );

        } catch (error) {

            console.error(
                "Get Reviews Error:",
                error
            );

        } finally {

            setReviewsLoading(false);

        }

    }


    // ==========================================
    // LOAD GADGET WHEN PAGE OPENS
    // ==========================================

    useEffect(() => {

        if (slug) {

            loadGadget();

        }

    }, [slug]);


    // ==========================================
    // LOAD REVIEWS AFTER GADGET LOADS
    // ==========================================

    useEffect(() => {

        if (gadget?.id) {

            loadReviews();

        }

    }, [gadget?.id]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main className={styles.loading}>

                <p>
                    Loading gadget...
                </p>

            </main>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <main className={styles.error}>

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
    // NOT FOUND
    // ==========================================

    if (!gadget) {

        return (

            <main className={styles.notFound}>

                <p>
                    Gadget not found.
                </p>

                <Link href="/gadgets">
                    Back to Gadgets
                </Link>

            </main>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <main className={styles.main}>

            {/* BACK */}

            <Link
                href="/gadgets"
                className={styles.backLink}
            >
                ← Back to Gadgets
            </Link>


            {/* ==================================
                GADGET INFORMATION
            ================================== */}

            <section
                className={styles.product}
            >

                <div
                    className={
                        styles.imageContainer
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

                        <p>
                            No image available
                        </p>

                    )}

                </div>


                <div
                    className={styles.info}
                >

                    <span
                        className={
                            styles.brand
                        }
                    >
                        {gadget.brand.name}
                    </span>


                    <h1
                        className={
                            styles.title
                        }
                    >
                        {gadget.name}
                    </h1>


                    <p
                        className={
                            styles.rating
                        }
                    >
                        ⭐ {gadget.avgRating}
                    </p>


                    <div
                        className={
                            styles.details
                        }
                    >

                        <div
                            className={
                                styles.detailItem
                            }
                        >

                            <span
                                className={
                                    styles.label
                                }
                            >
                                Model:
                            </span>

                            <span>
                                {gadget.model}
                            </span>

                        </div>


                        <div
                            className={
                                styles.detailItem
                            }
                        >

                            <span
                                className={
                                    styles.label
                                }
                            >
                                Category:
                            </span>

                            <span>
                                {gadget.category.name}
                            </span>

                        </div>


                        <div
                            className={
                                styles.detailItem
                            }
                        >

                            <span
                                className={
                                    styles.label
                                }
                            >
                                Released:
                            </span>

                            <span>
                                {gadget.releaseYear}
                            </span>

                        </div>

                    </div>


                    <p>
                        {gadget.category.description}
                    </p>

                </div>

            </section>


            {/* ==================================
                DESCRIPTION
            ================================== */}

            <section
                className={
                    styles.descriptionSection
                }
            >

                <h2>
                    About {gadget.name}
                </h2>

                <p
                    className={
                        styles.description
                    }
                >
                    {gadget.description}
                </p>

            </section>


            {/* ==================================
                REVIEWS
            ================================== */}

            <section>

                <h2>
                    Reviews
                </h2>


                {reviewsLoading && (

                    <p>
                        Loading reviews...
                    </p>

                )}


                {!reviewsLoading &&
                    reviews.length === 0 && (

                        <p>
                            No reviews yet.
                        </p>

                    )}


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
                                            async () => {

                                                await loadReviews();

                                                await loadGadget();

                                            }
                                        }
                                        onReviewDeleted={
                                            async () => {

                                                await loadReviews();

                                                await loadGadget();

                                            }
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

            </section>


            {/* ==================================
                WRITE REVIEW
            ================================== */}

            <ReviewForm
                gadgetId={
                    gadget.id
                }
                onReviewCreated={
                    async () => {

                        await loadReviews();

                        await loadGadget();

                    }
                }
            />

        </main>

    );

}