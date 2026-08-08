import Link from "next/link";
import styles from "./ReviewCard.module.css";

export default function ReviewCard({ review }) {
    return (
        <article className={styles.card}>

            <div className={styles.header}>

                <div>
                    <p className={styles.user}>
                        {review.user.name}
                    </p>

                    <p className={styles.rating}>
                        {"⭐".repeat(review.rating)}
                    </p>
                </div>

                <span className={styles.date}>
                    {new Date(
                        review.createdAt
                    ).toLocaleDateString()}
                </span>

            </div>

            <h3 className={styles.title}>
                {review.title}
            </h3>

            <Link
                href={`/gadgets/${review.gadget.slug}`}
                className={styles.gadget}
            >
                {review.gadget.name}
            </Link>

        </article>
    );
}