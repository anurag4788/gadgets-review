"use client";

import { useEffect, useState } from "react";

import userService from "@/services/userService";
import Link from "next/link";

export default function AdminUsersPage() {

    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pagination, setPagination] =
        useState({
            currentPage: 1,
            limit: 10,
            totalUsers: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
        });


    // ==========================================
    // LOAD USERS
    // ==========================================

    async function loadUsers() {

        try {

            setLoading(true);
            setError("");

            const response =
                await userService.getAll({

                    page,
                    limit: 2,
                    search,

                });


            const data =
                response.data.data;


            setUsers(
                data.users || []
            );


            setPagination(
                data.pagination
            );


        } catch (error) {

            console.error(
                "Admin Users Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load users."
            );

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // FETCH USERS
    // ==========================================

    useEffect(() => {

        loadUsers();

    }, [page, search]);


    // ==========================================
    // SEARCH
    // ==========================================

    function handleSearch(event) {

        setSearch(
            event.target.value
        );

        setPage(1);

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main>

                <h1>
                    Manage Users
                </h1>

                <p>
                    Loading users...
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
                    Manage Users
                </h1>

                <p>
                    {error}
                </p>

                <button
                    onClick={loadUsers}
                >
                    Try Again
                </button>

            </main>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <main>

            <div>

                <h1>
                    Manage Users
                </h1>

            </div>


            {/* ==================================
                SEARCH
            ================================== */}

            <div>

                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by name or email..."
                />

            </div>


            {/* ==================================
                USER COUNT
            ================================== */}

            <p>

                Total Users:{" "}

                {pagination.totalUsers}

            </p>


            {/* ==================================
                USERS
            ================================== */}

            {users.length === 0 ? (

                <p>
                    No users found.
                </p>

            ) : (

                <div>

                    {users.map(
                        (user) => (

                            <article key={user.id}>

                                <h2>
                                    {user.name}
                                </h2>

                                <p>
                                    Email: {user.email}
                                </p>

                                <p>
                                    Role: {user.role}
                                </p>

                                <p>
                                    Reviews: {user._count.reviews}
                                </p>

                                <p>
                                    Likes: {user._count.likes}
                                </p>

                                <p>
                                    Joined:{" "}
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <Link
                                    href={`/admin/users/${user.id}`}
                                >
                                    View
                                </Link>

                            </article>

                        )
                    )}

                </div>

            )}


            {/* ==================================
                PAGINATION
            ================================== */}

            {pagination.totalPages > 1 && (

                <div>

                    <button
                        disabled={
                            !pagination.hasPreviousPage ||
                            loading
                        }
                        onClick={() =>
                            setPage(
                                (previous) =>
                                    previous - 1
                            )
                        }
                    >
                        Previous
                    </button>


                    <span>

                        Page{" "}

                        {pagination.currentPage}

                        {" "}of{" "}

                        {pagination.totalPages}

                    </span>


                    <button
                        disabled={
                            !pagination.hasNextPage ||
                            loading
                        }
                        onClick={() =>
                            setPage(
                                (previous) =>
                                    previous + 1
                            )
                        }
                    >
                        Next
                    </button>

                </div>

            )}

        </main>

    );

}