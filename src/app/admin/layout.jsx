import Link from "next/link";

export default function AdminLayout({ children }) {

    return (
        <div>

            <nav>

                <h2>
                    Admin Panel
                </h2>

                <Link href="/admin/dashboard">
                    Dashboard
                </Link>

                <Link href="/admin/gadgets">
                    Gadgets
                </Link>

                <Link href="/admin/brands">
                    Brands
                </Link>

                <Link href="/admin/categories">
                    Categories
                </Link>

                <Link href="/admin/reviews">
                    Reviews
                </Link>

                <Link href="/admin/users">
                    Users
                </Link>

                <Link href="/">
                    Back to Website
                </Link>

            </nav>


            <main>
                {children}
            </main>

        </div>
    );
}