"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import brandService from "@/services/brandService";

import styles from "./page.module.css";

export default function BrandPage() {

    const params = useParams();
    const slug = params.slug;

    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        async function loadBrand() {

            try {

                setLoading(true);
                setError("");

                const response =
                    await brandService.getBySlug(slug);

                setBrand(
                    response.data.data
                );

            } catch (error) {

                console.error(
                    "Get Brand Error:",
                    error
                );

                if (
                    error.response?.status === 404
                ) {

                    setError(
                        "Brand not found."
                    );

                } else {

                    setError(
                        "Failed to load brand."
                    );

                }

            } finally {

                setLoading(false);

            }

        }

        if (slug) {
            loadBrand();
        }

    }, [slug]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main className={styles.pageState}>

                <div className={styles.loader} />

                <h1>
                    Loading brand...
                </h1>

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
                    Brand
                </h1>

                <p>
                    {error}
                </p>

                <Link
                    href="/gadgets"
                    className={styles.backLink}
                >
                    ← Back to Gadgets
                </Link>

            </main>

        );

    }


    // ==========================================
    // NOT FOUND
    // ==========================================

    if (!brand) {

        return (

            <main className={styles.pageState}>

                <h1>
                    Brand not found
                </h1>

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

            {/* ==================================
                BACK
            ================================== */}

            <Link
                href="/gadgets"
                className={styles.backLink}
            >
                ← Back to Gadgets
            </Link>


            {/* ==================================
                BRAND INFORMATION
            ================================== */}

            <section className={styles.brandSection}>

                <div className={styles.logoWrapper}>

                    {brand.logo ? (

                        <img
                            src={brand.logo}
                            alt={`${brand.name} logo`}
                            className={styles.logo}
                        />

                    ) : (

                        <div className={styles.noLogo}>
                            {brand.name
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                    )}

                </div>


                <div className={styles.brandInfo}>

                    <p className={styles.eyebrow}>
                        Brand
                    </p>

                    <h1 className={styles.title}>
                        {brand.name}
                    </h1>

                    {brand.description && (

                        <p className={styles.description}>
                            {brand.description}
                        </p>

                    )}

                    {brand.website && (

                        <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.websiteButton}
                        >
                            Visit Official Website ↗
                        </a>

                    )}

                </div>

            </section>


            {/* ==================================
                GADGETS
            ================================== */}

            <section className={styles.gadgetsSection}>

                <div className={styles.sectionHeader}>

                    <div>

                        <p className={styles.eyebrow}>
                            Products
                        </p>

                        <h2 className={styles.sectionTitle}>
                            {brand.name} Gadgets
                        </h2>

                    </div>

                    <span className={styles.count}>
                        {brand.gadgets.length} gadgets
                    </span>

                </div>


                {brand.gadgets.length === 0 ? (

                    <div className={styles.emptyState}>

                        <h3>
                            No gadgets found
                        </h3>

                        <p>
                            There are currently no gadgets
                            associated with this brand.
                        </p>

                    </div>

                ) : (

                    <div className={styles.gadgetGrid}>

                        {brand.gadgets.map(
                            (gadget) => (

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
                                                <strong>
                                                    Model:
                                                </strong>{" "}
                                                {gadget.model}
                                            </p>

                                        )}

                                        {gadget.releaseYear && (

                                            <p className={styles.gadgetDetail}>
                                                <strong>
                                                    Released:
                                                </strong>{" "}
                                                {gadget.releaseYear}
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

                            )
                        )}

                    </div>

                )}

            </section>

        </main>

    );

}
