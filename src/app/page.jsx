"use client";

import { useEffect, useState } from "react";

import homeService from "@/services/homeService";

import GadgetCard from "@/components/gadgets/GadgetCard";
import BrandCard from "@/components/brands/BrandCard";
import CategoryCard from "@/components/categories/CategoryCard";
import ReviewCard from "@/components/reviews/ReviewCard";

import styles from "./page.module.css";

export default function Home() {

    const [homeData, setHomeData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function loadHomeData() {

            try {

                const response =
                    await homeService.getHomeData();

                setHomeData(
                    response.data.data
                );

            } catch (error) {

                console.error(
                    "Home API Error:",
                    error
                );

                setError(
                    "Failed to load home data."
                );

            } finally {

                setLoading(false);

            }

        }

        loadHomeData();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main className={styles.pageState}>

                <div className={styles.loader} />

                <p>
                    Loading gadgets...
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

                <h1>
                    Something went wrong
                </h1>

                <p>
                    {error}
                </p>

            </main>

        );

    }


    return (

        <main className={styles.main}>


            {/* ==================================
                HERO
            ================================== */}

            <section className={styles.hero}>

                <div className={styles.heroContent}>

                    <span className={styles.heroBadge}>
                        Discover. Compare. Review.
                    </span>

                    <h1 className={styles.heroTitle}>
                        Find the right gadget
                        <span>
                            for you.
                        </span>
                    </h1>

                    <p className={styles.heroDescription}>
                        Explore the latest gadgets,
                        compare products, discover
                        trusted brands, and read
                        reviews from real users.
                    </p>

                </div>

            </section>


            {/* ==================================
                LATEST GADGETS
            ================================== */}

            <section className={styles.section}>

                <div className={styles.sectionHeader}>

                    <div>

                        <p className={styles.eyebrow}>
                            Recently added
                        </p>

                        <h2 className={styles.sectionTitle}>
                            Latest Gadgets
                        </h2>

                    </div>

                    <span className={styles.sectionCount}>
                        {homeData.latestGadgets.length} gadgets
                    </span>

                </div>


                <div className={styles.gadgetGrid}>

                    {homeData.latestGadgets.map(
                        (gadget) => (

                            <GadgetCard
                                key={gadget.id}
                                gadget={gadget}
                            />

                        )
                    )}

                </div>

            </section>


            {/* ==================================
                TOP RATED
            ================================== */}

            <section className={styles.section}>

                <div className={styles.sectionHeader}>

                    <div>

                        <p className={styles.eyebrow}>
                            Community favorites
                        </p>

                        <h2 className={styles.sectionTitle}>
                            Top Rated Gadgets
                        </h2>

                    </div>

                </div>


                <div className={styles.gadgetGrid}>

                    {homeData.topRatedGadgets.map(
                        (gadget) => (

                            <GadgetCard
                                key={gadget.id}
                                gadget={gadget}
                            />

                        )
                    )}

                </div>

            </section>


            {/* ==================================
                BRANDS
            ================================== */}

            <section className={styles.section}>

                <div className={styles.sectionHeader}>

                    <div>

                        <p className={styles.eyebrow}>
                            Explore manufacturers
                        </p>

                        <h2 className={styles.sectionTitle}>
                            Featured Brands
                        </h2>

                    </div>

                </div>


                <div className={styles.brandGrid}>

                    {homeData.featuredBrands.map(
                        (brand) => (

                            <BrandCard
                                key={brand.id}
                                brand={brand}
                            />

                        )
                    )}

                </div>

            </section>


            {/* ==================================
                CATEGORIES
            ================================== */}

            <section className={styles.section}>

                <div className={styles.sectionHeader}>

                    <div>

                        <p className={styles.eyebrow}>
                            Browse by type
                        </p>

                        <h2 className={styles.sectionTitle}>
                            Categories
                        </h2>

                    </div>

                </div>


                <div className={styles.categoryGrid}>

                    {homeData.categories.map(
                        (category) => (

                            <CategoryCard
                                key={category.id}
                                category={category}
                            />

                        )
                    )}

                </div>

            </section>


            {/* ==================================
                REVIEWS
            ================================== */}

            <section className={styles.section}>

                <div className={styles.sectionHeader}>

                    <div>

                        <p className={styles.eyebrow}>
                            What people are saying
                        </p>

                        <h2 className={styles.sectionTitle}>
                            Latest Reviews
                        </h2>

                    </div>

                </div>


                <div className={styles.reviewGrid}>

                    {homeData.latestReviews.map(
                        (review) => (

                            <ReviewCard
                                key={review.id}
                                review={review}
                            />

                        )
                    )}

                </div>

            </section>


        </main>

    );

}