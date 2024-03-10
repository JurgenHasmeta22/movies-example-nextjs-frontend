import styles from "../styles/Footer.module.css";

export default function Footer() {
    return (
        <>
            <footer className={styles["footer"]}>
                <span className={styles["footer-span"]}>
                    Copyright © 2021 - 2022 | movielandia24.so - Filma dhe Seriale HD me titra shqip / NetFlix shqip!
                </span>
                <span className={styles["footer-span"]}>
                    Disclaimer: This site does not store any files on its server! All contents are provided by
                    non-affiliated third parties!
                </span>
            </footer>
        </>
    );
}
