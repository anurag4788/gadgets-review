"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import categoryService from "@/services/categoryService";

import styles from "./page.module.css";

export default function CategoryPage() {

    const params = useParams();
    const slug = params.slug;

    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        async function loadCategory() {

            try {

                setLoading(true);
                setError("");

                const response =
                    await categoryService.getBySlug(slug);

                setCategory(response.data.data);

            } catch (error) {

                console.error("Get Category Error:", error);

                if (error.response?.status === 404) {
                    setError("Category not found.");
                } else {
                    setError("Failed to load category.");
                }

            } finally {

                setLoading(false);

            }

        }

        if (slug) loadCategory();

    }, [slug]);


    // LOADING

    if (loading) {

        return (
            <main className={styles.pageState}>
                <div className={styles.loader}/>
                <h1>Loading category...</h1>
            </main>
        );

    }


    // ERROR

    if (error) {

        return (
            <main className={styles.pageState}>
                <h1>Category</h1>
                <p>{error}</p>

                <Link
                    href="/gadgets"
                    className={styles.backLink}
                >
                    ← Back to Gadgets
                </Link>
            </main>
        );

    }


    // NOT FOUND

    if (!category) {

        return (
            <main className={styles.pageState}>
                <h1>Category not found</h1>

                <Link
                    href="/gadgets"
                    className={styles.backLink}
                >
                    ← Back to Gadgets
                </Link>
            </main>
        );

    }


    return (

        <main className={styles.container}>

            {/* BACK */}

            <Link
                href="/gadgets"
                className={styles.backLink}
            >
                ← Back to Gadgets
            </Link>


            {/* CATEGORY INFO */}

            <section className={styles.categorySection}>

                <div className={styles.iconWrapper}>
                    📱
                </div>

                <div className={styles.categoryInfo}>

                    <p className={styles.eyebrow}>
                        Category
                    </p>

                    <h1 className={styles.title}>
                        {category.name}
                    </h1>

                    {category.description && (
                        <p className={styles.description}>
                            {category.description}
                        </p>
                    )}

                </div>

            </section>


            {/* CATEGORY GADGETS */}

            <section className={styles.gadgetsSection}>

                <div className={styles.sectionHeader}>

                    <div>

                        <p className={styles.eyebrow}>
                            Products
                        </p>

                        <h2 className={styles.sectionTitle}>
                            {category.name} Gadgets
                        </h2>

                    </div>

                    <span className={styles.count}>
                        {category.gadgets.length} gadgets
                    </span>

                </div>


                {category.gadgets.length === 0 ? (

                    <div className={styles.emptyState}>
                        <h3>No gadgets found.</h3>
                        <p>This category doesn't have gadgets yet.</p>
                    </div>

                ) : (

                    <div className={styles.gadgetGrid}>

                        {category.gadgets.map((gadget) => (

                            <article
                                key={gadget.id}
                                className={styles.gadgetCard}
                            >

                                <div className={styles.imageWrapper}>

                                    {gadget.image ? (

                                        <img
                                            src={gadget.image}
                                            alt={gadget.name}
                                            className={styles.gadgetImage}
                                        />

                                    ) : (

                                        <div className={styles.noImage}>
                                            No Image
                                        </div>

                                    )}

                                </div>


                                <div className={styles.gadgetContent}>

                                    <h3 className={styles.gadgetName}>
                                        {gadget.name}
                                    </h3>

                                    {gadget.model && (
                                        <p className={styles.gadgetDetail}>
                                            <strong>Model:</strong> {gadget.model}
                                        </p>
                                    )}

                                    {gadget.releaseYear && (
                                        <p className={styles.gadgetDetail}>
                                            <strong>Released:</strong> {gadget.releaseYear}
                                        </p>
                                    )}

                                    <Link
                                        href={`/gadgets/${gadget.slug}`}
                                        className={styles.viewButton}
                                    >
                                        View Gadget
                                    </Link>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>

        </main>

    );

}