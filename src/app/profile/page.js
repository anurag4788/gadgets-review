"use client";

import useAuth from "@/hooks/useAuth";

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

        <div>

            <h1>{user.name}</h1>

            <p>{user.email}</p>

            <p>{user.role}</p>

        </div>

    );

}