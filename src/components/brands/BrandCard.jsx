import Link from "next/link";
import styles from "./BrandCard.module.css";

export default function BrandCard({ brand }) {
    return (
        <article className={styles.card}>

            <div className={styles.logoWrapper}>

                {brand.logo ? (
                    <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className={styles.logo}
                    />
                ) : (
                    <div className={styles.noLogo}>
                        {brand.name.charAt(0)}
                    </div>
                )}

            </div>

            <h3 className={styles.name}>
                {brand.name}
            </h3>

            <Link
                href={`/brands/${brand.slug}`}
                className={styles.button}
            >
                View Brand
            </Link>

        </article>
    );
}