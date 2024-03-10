import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import styles from "../../styles/Genre.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// export async function getStaticProps(context) {
//   const { slug } = context.params;

//   const slugSplitted = slug
//     .split("")
//     .map((char) => (char === "-" ? " " : char))
//     .join("");

//   const res = await axios(
//     `http://localhost:4000/genres/${slugSplitted}?page=1`
//   );
//   const genre = res.data;

//   return {
//     props: { genre },
//     //   revalidate: 60,
//   };
// }

export async function getServerSideProps(context) {
    const { slug } = context.params;

    // const { page } = context.query
    // console.log(context)
    // const page = context.query.hasOwnProperty("page")
    //   ? parseInt(context.query.page, 10)
    //   : 1;

    const slugSplitted = slug
        .split("")
        .map(char => (char === "-" ? " " : char))
        .join("");

    const res = await axios(
        `http://localhost:4000/genres/${slugSplitted}?page=${context.query.page ? context.query.page : "1"}`
    );
    const genre = res.data;

    return {
        props: { genre }
    };
}

// export async function getStaticPaths() {
//   const res = await axios(`http://localhost:4000/genres`);
//   const genres = res.data;

//   const titles = genres.map((genre) => genre.name);

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

export default function GenrePage({ genre }) {
    const router = useRouter();
    const [pageNumber, setPageNumber] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    let pagesVisited = pageNumber * itemsPerPage;
    const pageCount = Math.ceil(genre.count / itemsPerPage);

    function handleChangingPageNumber(selected) {
        setPageNumber(selected);
    }

    function changePage({ selected }) {
        router.push(`/genres/${router.query.slug}?page=${selected + 1}`);
    }

    return (
        <>
            <div className={styles["genre-wrapper-menus"]}>
                <Header />
                <div className={styles["genre-ribbon-1"]}>
                    <span className={styles["movie-count-span"]}>Total movies in this genre: {genre.count} </span>

                    <div className={styles["image-ribbon-1-genre-wrapper"]}>
                        {genre.movies?.map(movie => (
                            <div
                                className={styles["movie-item-genre"]}
                                key={movie.id}
                                onClick={function (e) {
                                    e.stopPropagation();
                                    router.push(
                                        `/movie/${movie.title
                                            .split("")
                                            .map(char => (char === " " ? "-" : char))
                                            .join("")}`
                                    );
                                }}
                            >
                                <img src={movie?.photoSrc} />
                                <span className={styles["movie-title"]}>{movie?.title}</span>

                                <div className={styles["genres-holder-span"]}>
                                    {movie?.genres.map(genre => (
                                        <span
                                            key={genre.genre.name}
                                            onClick={function (e) {
                                                e.stopPropagation();
                                                router.push(`/genres/${genre.genre.name}`);
                                            }}
                                        >
                                            {genre.genre.name}
                                        </span>
                                    ))}
                                </div>

                                <span className={styles["imdb-span"]}>
                                    {movie?.ratingImdb !== 0 ? "Imdb: " + movie?.ratingImdb : "Imdb: " + "N/A"}
                                </span>
                            </div>
                        ))}
                    </div>

                    <ReactPaginate
                        previousLabel={"< Previous"}
                        nextLabel={"Next >"}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName={styles["paginationBttns"]}
                        previousLinkClassName={styles["previousBttn"]}
                        nextLinkClassName={styles["nextBttn"]}
                        disabledClassName={styles["paginationDisabled"]}
                        activeClassName={styles["paginationActive"]}
                    />
                </div>
                <Footer />
            </div>
            <Footer />
        </>
    );
}
