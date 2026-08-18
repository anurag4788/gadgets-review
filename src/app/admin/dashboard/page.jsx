"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD DASHBOARD
    // ==========================================

    useEffect(() => {

        async function loadDashboard() {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        "/admin/dashboard"
                    );

                setDashboard(
                    response.data.data
                );

            } catch (error) {

                console.error(
                    "Admin Dashboard Error:",
                    error
                );

                if (
                    error.response?.status === 401
                ) {

                    setError(
                        "You must be logged in."
                    );

                } else if (
                    error.response?.status === 403
                ) {

                    setError(
                        "Admin access required."
                    );

                } else {

                    setError(
                        error.response?.data?.message ||
                        "Failed to load dashboard."
                    );

                }

            } finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <main className={styles.dashboard}>

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    Loading dashboard...
                </p>

            </main>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <main className={styles.dashboard}>

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    {error}
                </p>

            </main>
        );

    }


    // ==========================================
    // NO DATA
    // ==========================================

    if (!dashboard) {

        return (
            <main className={styles.dashboard}>

                <p>
                    No dashboard data available.
                </p>

            </main>
        );

    }


    const {
        statistics,
        recentUsers,
        recentReviews,
    } = dashboard;


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <main className={styles.dashboard}>

            <h1>
                Admin Dashboard
            </h1>


            {/* ==================================
                STATISTICS
            ================================== */}

            <section>

                <h2>
                    Statistics
                </h2>

                <div>

                    <div>
                        <h3>
                            Users
                        </h3>

                        <p>
                            {statistics.totalUsers}
                        </p>
                    </div>


                    <div>
                        <h3>
                            Gadgets
                        </h3>

                        <p>
                            {statistics.totalGadgets}
                        </p>
                    </div>


                    <div>
                        <h3>
                            Reviews
                        </h3>

                        <p>
                            {statistics.totalReviews}
                        </p>
                    </div>


                    <div>
                        <h3>
                            Brands
                        </h3>

                        <p>
                            {statistics.totalBrands}
                        </p>
                    </div>


                    <div>
                        <h3>
                            Categories
                        </h3>

                        <p>
                            {statistics.totalCategories}
                        </p>
                    </div>


                    <div>
                        <h3>
                            Likes
                        </h3>

                        <p>
                            {statistics.totalLikes}
                        </p>
                    </div>

                </div>

            </section>


            {/* ==================================
                RECENT USERS
            ================================== */}

            <section>

                <h2>
                    Recent Users
                </h2>

                {recentUsers.length === 0 ? (

                    <p>
                        No users found.
                    </p>

                ) : (

                    <div>

                        {recentUsers.map(
                            (user) => (

                                <article
                                    key={user.id}
                                >

                                    <h3>
                                        {user.name}
                                    </h3>

                                    <p>
                                        Email:{" "}
                                        {user.email}
                                    </p>

                                    <p>
                                        Role:{" "}
                                        {user.role}
                                    </p>

                                    <p>
                                        Joined:{" "}
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                </article>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* ==================================
                RECENT REVIEWS
            ================================== */}

            <section>

                <h2>
                    Recent Reviews
                </h2>

                {recentReviews.length === 0 ? (

                    <p>
                        No reviews found.
                    </p>

                ) : (

                    <div>

                        {recentReviews.map(
                            (review) => (

                                <article
                                    key={review.id}
                                >

                                    <h3>
                                        {review.title}
                                    </h3>

                                    <p>
                                        ⭐{" "}
                                        {review.rating}
                                    </p>

                                    <p>
                                        By{" "}
                                        {review.user.name}
                                    </p>

                                    <p>
                                        Gadget:{" "}
                                        {review.gadget.name}
                                    </p>

                                    <p>
                                        Created:{" "}
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                </article>

                            )
                        )}

                    </div>

                )}

            </section>

        </main>

    );

}