import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../../styles/Profile.module.css";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

// export async function getServerSideProps(context) {
//   const { slug } = context.params;
//   let res;

//   if (window.localStorage.token) {
//     res = fetch("http://localhost:4000/validate", {
//       headers: {
//         Authorization: window.localStorage.token,
//       },
//     });
//   }

//   const user = res.data;

//   return {
//     props: { user },
//   };
// }

export default function ProfilePage() {
    const [tab, setTab] = useState("home");
    const [user, setUser] = useState(null);

    const router = useRouter();

    function validateUser() {
        if (localStorage.token) {
            fetch("http://localhost:4000/validate", {
                headers: {
                    Authorization: localStorage.token
                }
            })
                .then(resp => resp.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        setUser(data.user);
                    }
                });
        }
    }

    useEffect(() => {
        validateUser();
    }, []);

    return (
        <main>
            <Header />

            <section className={styles["container-profile-menus"]}>
                <div className={styles["container-profile-nav"]}>
                    <div className={styles["profile-info"]}>
                        <img src='/assets/avatars/blankavatar.jpg' />
                        <span className={styles["userName-span"]}>{user?.userName}</span>
                    </div>
                </div>

                <div className={styles["container-tabs"]}>
                    <ul className={styles["list-tabs"]}>
                        <li
                            className={tab === "favoriteMovies" ? styles["clicked"] : styles["videos-tab"]}
                            onClick={function () {
                                setTab("favoriteMovies");
                            }}
                        >
                            Favorite Movies
                        </li>

                        <li
                            className={tab === "aboutUs" ? styles["clicked"] : styles["about-tab"]}
                            onClick={function () {
                                setTab("aboutUs");
                            }}
                        >
                            About Channel
                        </li>
                    </ul>

                    {tab === "favoriteMovies" ? (
                        <>
                            <h3 className={styles["special-video-you"]}>Bookmarked movies</h3>

                            <div className={styles["container-videos"]}>
                                <ul className={styles["favorite-movies"]}>
                                    {user?.favMovies.map(movie => (
                                        <li
                                            className={styles["movie-fav"]}
                                            key={movie.id}
                                            onClick={function () {
                                                router.push(
                                                    `../movies/${movie?.title
                                                        .split("")
                                                        .map(char => (char === " " ? "-" : char))
                                                        .join("")}`
                                                );
                                            }}
                                        >
                                            <img src={movie?.photoSrc} />
                                            <span>Movie title: {movie?.title}</span>
                                            <span>Release year: {movie?.releaseYear}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : tab === "aboutUs" ? (
                        <div className={styles["container-about"]}>
                            <span>This is my account</span>
                        </div>
                    ) : null}
                </div>
            </section>
            <Footer />
        </main>
    );
}
