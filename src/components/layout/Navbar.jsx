"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
        <nav>

            {/* Logo */}
            <div>
                <Link href="/">
                    Gadgets Review
                </Link>
            </div>

            {/* Navigation */}
            <div>

                <Link href="/">
                    Home
                </Link>

                <Link href="/gadgets">
                    Gadgets
                </Link>

                {isAuthenticated ? (
                    <>
                        <span>
                            Hi, {user.name}
                        </span>

                        <Link href="/profile">
                            Profile
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            Login
                        </Link>

                        <Link href="/register">
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}