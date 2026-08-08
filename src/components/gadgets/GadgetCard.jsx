import Link from "next/link";
import styles from "./GadgetCard.module.css";

export default function GadgetCard({ gadget }) {
    return (
        <article className={styles.card}>

            <div className={styles.imageWrapper}>
                {gadget.image ? (
                    <img
                        src={gadget.image}
                        alt={gadget.name}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.noImage}>
                        No Image
                    </div>
                )}
            </div>

            <div className={styles.content}>

                <p className={styles.brand}>
                    {gadget.brand.name}
                </p>

                <h3 className={styles.name}>
                    {gadget.name}
                </h3>

                <div className={styles.details}>
                    <span>
                        ⭐ {gadget.avgRating}
                    </span>

                    {gadget.releaseYear && (
                        <span>
                            {gadget.releaseYear}
                        </span>
                    )}
                </div>

                <Link
                    href={`/gadgets/${gadget.slug}`}
                    className={styles.button}
                >
                    View Gadget
                </Link>

            </div>

        </article>
    );
}