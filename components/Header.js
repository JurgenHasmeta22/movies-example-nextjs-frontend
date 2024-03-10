import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";
import Link from "next/link";
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";

// export async function getServerSideProps() {
//   const res = await axios(`http://localhost:4000/genres`);
//   const genres = res.data;

//   return {
//     props: { genres },
//   };
// }

export default function Header() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [genres, setGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

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
                        setUser(data);
                    }
                });
        }
    }

    useEffect(() => {
        validateUser();
    }, []);

    async function getGenres() {
        const res = await axios(`http://localhost:4000/genres`);
        const genres = res.data;
        setGenres(genres);
    }

    useEffect(() => {
        getGenres();
    }, []);

    function handleLogOut(e) {
        e.preventDefault();
        localStorage.removeItem("token");
        setUser(null);
        router.push("/loginv1");
    }

    function redirectToProfile(user) {
        router.push(`/profile/${user?.userName}`);
    }

    const options = [];

    for (const genre of genres) {
        options.push({ value: genre.name, label: genre.name });
    }

    return (
        <>
            <header className={styles["header"]}>
                <div className={styles["header-group-1"]}>
                    <Link href='/'>MovieLand24</Link>

                    <ul className={styles["list-nav"]}>
                        <div className={styles["div-inside-li"]}>
                            {/* <Image src="/static/logos/ico_filma_blu.png" alt="" width="40" height="40"/> */}
                            <img src='/static/logos/ico_filma_blu.png' alt='' />

                            <Link href='/' className={styles["special-uppercase"]}>
                                <li className={styles["special-uppercase"]}>Movies</li>
                            </Link>
                        </div>

                        <div className={styles["div-inside-li"]}>
                            {/* <Image src="/static/logos/ico_filma_blu.png" alt="" width="40" height="40"/> */}
                            <img src='/static/logos/ico_filma_blu.png' alt='' />

                            <Link href='/series'>
                                <li className={styles["special-uppercase"]}>Series</li>
                            </Link>
                        </div>

                        <div className={styles["div-inside-li-special"]}>
                            <div className={styles["dropdown"]}>
                                <div className={styles["genre-drop"]}>
                                    {/* <Image src="/static/logos/list_blu.png" alt="" width="40" height="40"/> */}
                                    <img src='/static/logos/list_blu.png' alt='' />

                                    <li
                                        className={styles["special-uppercase"]}
                                        onClick={function (e) {
                                            e.stopPropagation();
                                            router.push("/genres");
                                        }}
                                    >
                                        Genres
                                    </li>
                                </div>

                                <div className={styles["dropdown-content"]}>
                                    <ul>
                                        {genres.map(genre => (
                                            <li
                                                className={styles["special-list-drop"]}
                                                key={genre.id}
                                                onClick={function (e) {
                                                    e.stopPropagation();
                                                    router.push(`/genres/${genre.name}`);
                                                }}
                                            >
                                                {genre.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className={styles["div-inside-li"]}>
                            {/* <Image src="/static/logos/netflix-red.png" alt="" width="40" height="40"/> */}
                            <img src='/static/logos/netflix-red.png' alt='' />

                            <Link href='/genres/NETFLIX' className={styles["special-uppercase"]}>
                                <li className={styles["special-uppercase"]}>Netflix</li>
                            </Link>
                        </div>
                    </ul>
                </div>

                <div className={styles["header-group-2"]}>
                    <form
                        className={styles["button-search"]}
                        onSubmit={function (e) {
                            e.preventDefault();
                            setSearchTerm(e.target.value);
                            router.push(`?page=${router.query.page}&search=${e.target.value}`);
                        }}
                    >
                        <input
                            type='search'
                            name='searchMovie'
                            placeholder='Search for movies...'
                            aria-label='Search through site content'
                            onChange={function (e) {
                                if (e.target.value.length > 0) {
                                    setSearchTerm(e.target.value);
                                    router.push(`?page=1&search=${e.target.value}`);
                                } else {
                                    setSearchTerm(e.target.value);
                                    router.push(`?page=1`);
                                }
                            }}
                        />

                        <button type='submit'>
                            <SearchIcon />
                        </button>
                    </form>

                    {user === null ? (
                        <>
                            <button
                                className={styles["button-login-header"]}
                                onClick={function () {
                                    router.push("/loginv1");
                                }}
                            >
                                <AccountCircleIcon />
                                Sign In
                            </button>

                            <button
                                className={styles["button-login-header"]}
                                onClick={function () {
                                    router.push("/registerv1");
                                }}
                            >
                                <AccountCircleIcon />
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <div className={styles["dropdown"]}>
                            <li
                                className={styles["dropbtn"]}
                                onClick={function () {
                                    redirectToProfile(user);
                                }}
                            >
                                {/* <Image src={`/static/avatars/blankavatar.jpg`} alt="" width="64" height="64" /> */}
                                <img src={`/static/avatars/blankavatar.jpg`} alt='' />
                                {user?.userName}
                            </li>

                            <div className={styles["dropdown-content"]}>
                                <button
                                    className={styles["log-out"]}
                                    onClick={function (e) {
                                        handleLogOut(e);
                                    }}
                                >
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}
