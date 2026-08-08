"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";

import useAuth from "@/hooks/useAuth";

export default function LoginPage() {

    const router = useRouter();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {

        const { name, value } =
            event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    }

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            await login(formData);

            router.push("/");

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Login failed";

            setError(message);

        } finally {

            setLoading(false);

        }

    }

    return (

        <main className={styles.container}>

            <div className={styles.card}>

                <h1>Login</h1>

                <p className={styles.subtitle}>
                    Login to your Gadgets Review account
                </p>

                <form
                    onSubmit={handleSubmit}
                    className={styles.form}
                >

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
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    {error && (

                        <p className={styles.error}>
                            {error}
                        </p>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>


                <p className={styles.registerText}>

                    Don't have an account?{" "}

                    <Link href="/register">
                        Register
                    </Link>

                </p>

            </div>

        </main>

    );
}