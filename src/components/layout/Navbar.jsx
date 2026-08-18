"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import styles from "./Navbar.module.css";

export default function Navbar() {

    const router = useRouter();

    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();


    function handleLogout() {

        logout();

        router.push("/login");

    }


    return (

        <header className={styles.navbar}>

            <div className={styles.container}>

                {/* Logo */}

                <Link
                    href="/"
                    className={styles.logo}
                >
                    <span className={styles.logoIcon}>
                        G
                    </span>

                    <span>
                        Gadgets Review
                    </span>

                </Link>


                {/* Navigation */}

                <nav className={styles.nav}>

                    <Link
                        href="/"
                        className={styles.navLink}
                    >
                        Home
                    </Link>


                    <Link
                        href="/gadgets"
                        className={styles.navLink}
                    >
                        Gadgets
                    </Link>


                    {isAuthenticated ? (

                        <>

                            <Link
                                href="/wishlist"
                                className={styles.navLink}
                            >
                                <span>
                                    ♥
                                </span>

                                Wishlist
                            </Link>


                            <Link
                                href="/profile"
                                className={styles.profileLink}
                            >

                                <span className={styles.avatar}>
                                    {user?.name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </span>

                                <span>
                                    {user?.name}
                                </span>

                            </Link>


                            <button
                                type="button"
                                onClick={handleLogout}
                                className={styles.logoutButton}
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <>

                            <Link
                                href="/login"
                                className={styles.loginLink}
                            >
                                Login
                            </Link>


                            <Link
                                href="/register"
                                className={styles.registerButton}
                            >
                                Register
                            </Link>

                        </>

                    )}

                </nav>

            </div>

        </header>

    );

}