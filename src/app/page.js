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
                    "Failed to load home data"
                );

            } finally {

                setLoading(false);
            }
        }

        loadHomeData();

    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <main className={styles.main}>

            <h1 className={styles.title}>
                Gadgets Review
            </h1>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    Latest Gadgets
                </h2>

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

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    Top Rated Gadgets
                </h2>

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

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    Featured Brands
                </h2>

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

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    Categories
                </h2>

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

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    Latest Reviews
                </h2>

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