"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import userService from "@/services/userService";

export default function AdminUserDetailsPage() {

    const { id } = useParams();

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD USER
    // ==========================================

    async function loadUser() {

        try {

            setLoading(true);
            setError("");

            const response =
                await userService.getById(id);

            setUser(
                response.data.data
            );

        } catch (error) {

            console.error(
                "Admin User Details Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load user."
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        if (id) {
            loadUser();
        }

    }, [id]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main>

                <h1>
                    User Details
                </h1>

                <p>
                    Loading user...
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
                    User Details
                </h1>

                <p>
                    {error}
                </p>

                <Link href="/admin/users">
                    Back to Users
                </Link>

            </main>

        );

    }


    if (!user) {
        return null;
    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <main>

            <Link href="/admin/users">
                ← Back to Users
            </Link>


            <h1>
                User Details
            </h1>


            {/* ==================================
                USER INFORMATION
            ================================== */}

            <section>

                <h2>
                    Profile
                </h2>

                <p>
                    Name: {user.name}
                </p>

                <p>
                    Email: {user.email}
                </p>

                <p>
                    Role: {user.role}
                </p>

                <p>
                    Joined:{" "}

                    {new Date(
                        user.createdAt
                    ).toLocaleDateString()}

                </p>

            </section>


            {/* ==================================
                STATISTICS
            ================================== */}

            <section>

                <h2>
                    Statistics
                </h2>

                <p>
                    Reviews:{" "}
                    {user._count.reviews}
                </p>

                <p>
                    Likes:{" "}
                    {user._count.likes}
                </p>

            </section>


            {/* ==================================
                REVIEWS
            ================================== */}

            <section>

                <h2>
                    Reviews
                </h2>


                {user.reviews.length === 0 ? (

                    <p>
                        This user has not written
                        any reviews.
                    </p>

                ) : (

                    <div>

                        {user.reviews.map(
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
                                        {review.review}
                                    </p>


                                    <p>
                                        Gadget:{" "}
                                        {review.gadget.name}
                                    </p>


                                    <p>
                                        Brand:{" "}
                                        {review.gadget.brand.name}
                                    </p>


                                    <p>
                                        Category:{" "}
                                        {review.gadget.category.name}
                                    </p>


                                    <p>
                                        Likes:{" "}
                                        {review._count.likes}
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