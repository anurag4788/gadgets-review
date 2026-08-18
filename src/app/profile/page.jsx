"use client";

import { useState } from "react";
import Link from "next/link";

import useAuth from "@/hooks/useAuth";

export default function Profile() {

    const {
        user,
        loading,
        updateUser,
    } = useAuth();


    // ==========================================
    // EDIT MODE
    // ==========================================

    const [editing, setEditing] =
        useState(false);

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return <h1>Loading...</h1>;

    }


    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!user) {

        return <h1>Not Logged In</h1>;

    }


    // ==========================================
    // START EDITING
    // ==========================================

    function handleEdit() {

        setName(user.name);
        setEmail(user.email);

        setError("");
        setSuccess("");

        setEditing(true);

    }


    // ==========================================
    // CANCEL EDIT
    // ==========================================

    function handleCancel() {

        setName(user.name);
        setEmail(user.email);

        setError("");
        setSuccess("");

        setEditing(false);

    }


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");


        // ==========================================
        // FRONTEND VALIDATION
        // ==========================================

        if (name.trim().length < 2) {

            setError(
                "Name must be at least 2 characters."
            );

            return;

        }


        if (name.trim().length > 50) {

            setError(
                "Name cannot exceed 50 characters."
            );

            return;

        }


        if (!email.trim()) {

            setError(
                "Email is required."
            );

            return;

        }


        try {

            setSaving(true);


            await updateUser({

                name:
                    name.trim(),

                email:
                    email.trim()
                        .toLowerCase(),

            });


            setSuccess(
                "Profile updated successfully."
            );

            setEditing(false);

        } catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );


            // ==========================================
            // DUPLICATE EMAIL
            // ==========================================

            if (
                error.response?.status === 409
            ) {

                setError(
                    "Email is already in use."
                );

                return;

            }


            // ==========================================
            // UNAUTHORIZED
            // ==========================================

            if (
                error.response?.status === 401
            ) {

                setError(
                    "Your session has expired. Please login again."
                );

                return;

            }


            // ==========================================
            // VALIDATION ERROR
            // ==========================================

            if (
                error.response?.status === 400
            ) {

                setError(
                    error.response?.data?.message ||
                    "Please check your profile details."
                );

                return;

            }


            // ==========================================
            // GENERAL ERROR
            // ==========================================

            setError(
                error.response?.data?.message ||
                "Failed to update profile."
            );

        } finally {

            setSaving(false);

        }

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <main>

            <h1>
                My Profile
            </h1>


            {/* ======================================
                SUCCESS MESSAGE
            ====================================== */}

            {success && (

                <p>
                    {success}
                </p>

            )}


            {/* ======================================
                PROFILE INFORMATION
            ====================================== */}

            <section>

                <h2>
                    {user.name}
                </h2>

                <p>
                    Email: {user.email}
                </p>

                <p>
                    Role: {user.role}
                </p>


                {!editing && (

                    <button
                        type="button"
                        onClick={handleEdit}
                    >
                        Edit Profile
                    </button>

                )}

            </section>


            {/* ======================================
                EDIT PROFILE
            ====================================== */}

            {editing && (

                <section>

                    <h2>
                        Edit Profile
                    </h2>


                    {error && (

                        <p>
                            {error}
                        </p>

                    )}


                    <form
                        onSubmit={handleSubmit}
                    >

                        {/* NAME */}

                        <div>

                            <label>
                                Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                disabled={saving}
                            />

                        </div>


                        {/* EMAIL */}

                        <div>

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                disabled={saving}
                            />

                        </div>


                        {/* SAVE */}

                        <button
                            type="submit"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : "Save Changes"
                            }

                        </button>


                        {/* CANCEL */}

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                        >

                            Cancel

                        </button>

                    </form>

                </section>

            )}


            {/* ======================================
                ACTIVITY
            ====================================== */}

            <section>

                <h2>
                    Activity
                </h2>

                <p>
                    Reviews:{" "}
                    {user._count?.reviews ?? 0}
                </p>

                <p>
                    Likes:{" "}
                    {user._count?.likes ?? 0}
                </p>

            </section>


            {/* ======================================
                MY REVIEWS
            ====================================== */}

            <section>

                <h2>
                    My Reviews
                </h2>

                <Link href="/profile/reviews">
                    View My Reviews
                </Link>

            </section>


            {/* ======================================
                ACCOUNT
            ====================================== */}

            <section>

                <h2>
                    Account
                </h2>

                <p>
                    Joined:{" "}
                    {new Date(
                        user.createdAt
                    ).toLocaleDateString()}
                </p>

            </section>

        </main>

    );

}