import axios from "axios";
import styles from "../../../styles/Movie.module.css";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

// export async function getStaticProps(context) {
//   const { slug } = context.params;

//   const slugSplitted = slug
//     .split("")
//     .map((char) => (char === "-" ? " " : char))
//     .join("");

//   const res1 = await axios(`http://localhost:4000/movie/${slugSplitted}`);
//   const movie = res1.data;

//   const res2 = await axios(`http://localhost:4000/latest`);
//   const latestMovies = res2.data;

//   return {
//     props: { movie, latestMovies },
//     revalidate: 60,
//   };
// }

export async function getServerSideProps(context) {
    const { slug } = context.params;
    const slugSplitted = slug
        .split("")
        .map(char => (char === "-" ? " " : char))
        .join("");
    const res1 = await axios(`http://localhost:4000/movie/${slugSplitted}`);
    const movie = res1.data;
    const res2 = await axios(`http://localhost:4000/latest`);
    const latestMovies = res2.data;

    return {
        props: { movie, latestMovies }
    };
}

// export async function getStaticPaths() {
//   const res = await axios(`http://localhost:4000/movies`);
//   const movies = res.data;

//   const titles = movies.map((movie) => movie.title);

//   const paths = titles.map((title) => ({
//     params: {
//       slug: title
//         .split("")
//         .map((char) => (char === " " ? "-" : char))
//         .join(""),
//     },
//   }));

//   return {
//     paths,
//     fallback: false,
//   };
// }

const Movie = ({ movie, latestMovies }) => {
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
                        <div className={styles["movie-details"]}>
                            <div className={styles["movie-specifications"]}>
                                <ul className={styles["trailer"]}>
                                    <li>Trailer: </li>
                                    <a href={movie?.trailerSrc} className={styles["trailer-link"]}>
                                        Youtube trailer
                                    </a>
                                </ul>
                                <ul className={styles["length"]}>
                                    <li>Duration: {movie?.duration}</li>
                                    <li>Year: {movie?.releaseYear}</li>
                                    <li>Imdb Rating: {movie?.ratingImdb === 0 ? "N/A" : movie?.ratingImdb}</li>
                                </ul>
                                <button className={styles["button-favorite-add"]}>Add to favorites</button>
                            </div>
                        </div>
                    </div>
                    <div className={styles["movie-fabula"]}>
                        <p id={styles["fabula"]}>{movie?.description}</p>
                    </div>
                    <div className={styles["last movies"]}>
                        <div className={styles["posted-lastest"]}>
                            <h2>Latest Movies</h2>
                        </div>
                        <ul className={styles["last-movies-list"]}>
                            {latestMovies.slice(14, 19).map(latestMovie => (
                                <li
                                    key={latestMovie.id}
                                    onClick={function () {
                                        router.push(
                                            `/movie/${latestMovie.title
                                                .split("")
                                                .map(char => (char === " " ? "-" : char))
                                                .join("")}`
                                        );
                                    }}
                                >
                                    <img src={latestMovie.photoSrc} />
                                </li>
                            ))}
                        </ul>
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

export default Movie;
