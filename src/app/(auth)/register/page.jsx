"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import styles from "./Register.module.css";

export default function RegisterPage() {

    const router = useRouter();

    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    function handleChange(event) {

        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    }

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            await register(formData);

            setSuccess(
                "Registration successful. Redirecting to login..."
            );

            setTimeout(() => {
                router.push("/login");
            }, 1000);

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Registration failed";

            setError(message);

        } finally {

            setLoading(false);

        }

    }

    return (
        <main className={styles.container}>

            <div className={styles.card}>

                <h1>Create Account</h1>

                <p className={styles.subtitle}>
                    Create your Gadgets Review account
                </p>

                <form
                    onSubmit={handleSubmit}
                    className={styles.form}
                >

                    <div className={styles.field}>

                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />

                    </div>

                    <div className={styles.field}>

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />

                    </div>

                    <div className={styles.field}>

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                        />

                    </div>

                    {error && (
                        <p className={styles.error}>
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className={styles.success}>
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Register"}
                    </button>

                </form>

                <p className={styles.loginText}>

                    Already have an account?{" "}

                    <Link href="/login">
                        Login
                    </Link>

                </p>

            </div>

        </main>
    );
}