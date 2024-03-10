import axios from "axios";
import styles from "../../../styles/Movie.module.css";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export async function getServerSideProps(context) {
    const { slug } = context.params;

    // const slugSplitted = slug
    //   .split("")
    //   .map((char) => (char === "-" ? " " : char))
    //   .join("");

    const res = await axios(`http://localhost:4000/seria/${slug}`);
    const movie = res.data;

    return {
        props: { movie }
    };
}

const Seria = ({ movie }) => {
    const router = useRouter();

    return (
        <>
            <Header />
            <section className={styles["movie-item-wrapper"]}>
                <div className={styles["left-section"]}>
                    <div className={styles["video-and-servers"]}>
                        <div className={styles["servers"]}>
                            <ul className={styles["server-list"]}>
                                <li>Movie Server</li>
                            </ul>
                        </div>

                        <div className={styles["video-square"]}>
                            <iframe
                                src={movie?.videoSrc}
                                name='movieFrame'
                                scrolling='no'
                                frameBorder={0}
                                height='550px'
                                width='850px'
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                    <div className={styles["movie-fabula"]}>
                        <p id={styles["fabula"]}>{movie?.description}</p>
                    </div>
                </div>

                <div className={styles["right-section"]}>
                    <ul>
                        <li>
                            <img src='https://i.imgur.com/5wdcyDG.gif' alt='ddf' />
                        </li>

                        <li>
                            <img src='https://www.filma24.so/genti300x300.gif' alt='ggg' />
                        </li>

                        <li>
                            <img src='https://i.imgur.com/Wl3zKCb.jpg' alt='eee' />
                        </li>
                    </ul>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Seria;
