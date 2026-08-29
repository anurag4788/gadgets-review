"use client";

import { useState } from "react";
import Link from "next/link";

import useAuth from "@/hooks/useAuth";

import styles from "./page.module.css";

export default function Profile() {
    const {
        user,
        loading,
        updateUser,
    } = useAuth();

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (loading) {
        return (
            <main className={styles.pageState}>
                <div className={styles.loader} />
                <h1>Loading profile...</h1>
            </main>
        );
    }

    if (!user) {
        return (
            <main className={styles.pageState}>
                <div className={styles.emptyIcon}>?</div>
                <h1>Not Logged In</h1>
                <p>Please login to view your profile.</p>

                <Link
                    href="/login"
                    className={styles.primaryButton}
                >
                    Login
                </Link>
            </main>
        );
    }

    function handleEdit() {
        setName(user.name);
        setEmail(user.email);
        setError("");
        setSuccess("");
        setEditing(true);
    }

    function handleCancel() {
        setName(user.name);
        setEmail(user.email);
        setError("");
        setSuccess("");
        setEditing(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (name.trim().length < 2) {
            setError("Name must be at least 2 characters.");
            return;
        }

        if (name.trim().length > 50) {
            setError("Name cannot exceed 50 characters.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        try {
            setSaving(true);

            await updateUser({
                name: name.trim(),
                email: email.trim().toLowerCase(),
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

            if (error.response?.status === 409) {
                setError("Email is already in use.");
                return;
            }

            if (error.response?.status === 401) {
                setError(
                    "Your session has expired. Please login again."
                );
                return;
            }

            if (error.response?.status === 400) {
                setError(
                    error.response?.data?.message ||
                    "Please check your profile details."
                );
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to update profile."
            );

        } finally {
            setSaving(false);
        }
    }

    return (
        <main className={styles.main}>

            {/* HEADER */}

            <section className={styles.pageHeader}>

                <div>
                    <p className={styles.eyebrow}>
                        Account
                    </p>

                    <h1 className={styles.title}>
                        My Profile
                    </h1>

                    <p className={styles.subtitle}>
                        Manage your personal information
                        and account activity.
                    </p>
                </div>

            </section>


            {/* MESSAGES */}

            {success && (
                <div className={styles.success}>
                    ✓ {success}
                </div>
            )}

            {error && !editing && (
                <div className={styles.error}>
                    {error}
                </div>
            )}


            {/* PROFILE CARD */}

            <section className={styles.profileCard}>

                <div className={styles.profileHeader}>

                    <div className={styles.avatar}>
                        {user.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </div>

                    <div className={styles.profileIdentity}>
                        <h2>
                            {user.name}
                        </h2>

                        <p>
                            {user.email}
                        </p>
                    </div>

                    {!editing && (
                        <button
                            type="button"
                            onClick={handleEdit}
                            className={styles.editButton}
                        >
                            Edit Profile
                        </button>
                    )}

                </div>


                {/* PROFILE DETAILS */}

                {!editing && (
                    <div className={styles.detailsGrid}>

                        <div className={styles.detailItem}>
                            <span>
                                Email
                            </span>

                            <strong>
                                {user.email}
                            </strong>
                        </div>

                        <div className={styles.detailItem}>
                            <span>
                                Role
                            </span>

                            <strong className={styles.role}>
                                {user.role}
                            </strong>
                        </div>

                    </div>
                )}


                {/* EDIT FORM */}

                {editing && (
                    <div className={styles.editSection}>

                        <div className={styles.editHeader}>
                            <h2>
                                Edit Profile
                            </h2>

                            <p>
                                Update your account information.
                            </p>
                        </div>

                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className={styles.form}
                        >

                            <div className={styles.formGroup}>

                                <label htmlFor="name">
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(
                                            event.target.value
                                        )
                                    }
                                    disabled={saving}
                                    placeholder="Enter your name"
                                />

                            </div>


                            <div className={styles.formGroup}>

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    disabled={saving}
                                    placeholder="Enter your email"
                                />

                            </div>


                            <div className={styles.formActions}>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={styles.primaryButton}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>
                )}

            </section>


            {/* ACTIVITY */}

            <section className={styles.activitySection}>

                <div className={styles.sectionHeader}>

                    <div>
                        <p className={styles.eyebrow}>
                            Your activity
                        </p>

                        <h2>
                            Activity
                        </h2>
                    </div>

                </div>


                <div className={styles.activityGrid}>

                    <div className={styles.activityCard}>

                        <span className={styles.activityIcon}>
                            ★
                        </span>

                        <div>
                            <strong>
                                {user._count?.reviews ?? 0}
                            </strong>

                            <p>
                                Reviews
                            </p>
                        </div>

                    </div>


                    <div className={styles.activityCard}>

                        <span className={styles.activityIcon}>
                            ♥
                        </span>

                        <div>
                            <strong>
                                {user._count?.likes ?? 0}
                            </strong>

                            <p>
                                Likes
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            {/* MY REVIEWS */}

            <section className={styles.linkCard}>

                <div>
                    <p className={styles.eyebrow}>
                        Contributions
                    </p>

                    <h2>
                        My Reviews
                    </h2>

                    <p>
                        View and manage all the reviews
                        you have written.
                    </p>
                </div>

                <Link
                    href="/profile/reviews"
                    className={styles.secondaryButton}
                >
                    View My Reviews →
                </Link>

            </section>


            {/* ACCOUNT */}

            <section className={styles.accountCard}>

                <div>

                    <p className={styles.eyebrow}>
                        Account information
                    </p>

                    <h2>
                        Account
                    </h2>

                </div>

                <div className={styles.joined}>

                    <span>
                        Member since
                    </span>

                    <strong>
                        {new Date(
                            user.createdAt
                        ).toLocaleDateString()}
                    </strong>

                </div>

            </section>

        </main>
    );
}