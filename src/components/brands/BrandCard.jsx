import Link from "next/link";
import styles from "./BrandCard.module.css";

export default function BrandCard({ brand }) {
    return (
        <article className={styles.card}>

            {/* LOGO */}

            <div className={styles.logoWrapper}>

                {brand.logo ? (

                    <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className={styles.logo}
                    />

                ) : (

                    <div className={styles.noLogo}>
                        {brand.name?.charAt(0)?.toUpperCase()}
                    </div>

                )}

            </div>


            {/* BRAND NAME */}

            <h3 className={styles.name}>
                {brand.name}
            </h3>


            {/* VIEW BUTTON */}

            <Link
                href={`/brands/${brand.slug}`}
                className={styles.button}
            >
                View Brand
            </Link>

        </article>
    );
}