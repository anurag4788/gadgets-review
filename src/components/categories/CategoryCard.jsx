import Link from "next/link";
import styles from "./CategoryCard.module.css";

export default function CategoryCard({ category }) {
    return (
        <Link
            href={`/categories/${category.slug}`}
            className={styles.card}
        >
            <div className={styles.icon}>
                {category.name.charAt(0)}
            </div>

            <h3 className={styles.name}>
                {category.name}
            </h3>
        </Link>
    );
}