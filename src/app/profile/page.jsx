"use client";

import useAuth from "@/hooks/useAuth";
import Link from "next/link";

export default function Profile() {

    const {
        user,
        loading,
    } = useAuth();


    if (loading) {

        return <h1>Loading...</h1>;

    }


    if (!user) {

        return <h1>Not Logged In</h1>;

    }


    return (

        <main>

            <h1>
                My Profile
            </h1>


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

            </section>


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
            <section>
                <h2>
                    My Reviews
                </h2>

                <Link href="/profile/reviews">
                    View My Reviews
                </Link>
            </section>


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