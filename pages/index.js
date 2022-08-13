import axios from "axios";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import ReactPaginate from "react-paginate";
import Carousel from "@palustris/react-images";
import Link from "next/link";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// import useSwr from "swr";

// const fetcher = (url) => fetch(url).then((res) => res.json());

// export async function getStaticProps() {
//   const res1 = await axios(`http://localhost:4000/movies/page/1`);
//   const movies = res1.data;

//   const res2 = await axios(`http://localhost:4000/latest`);
//   const latestMovies = res2.data;

//   const res3 = await axios(`http://localhost:4000/movie-count`);
//   const moviesCount = res3.data;

//   return {
//     props: { movies, latestMovies, moviesCount },
//   };
// }

export async function getServerSideProps(context) {
  const url = `http://localhost:4000/movies/page/${
    context.query.page ? context.query.page : "1"
  }${
    context.query.sortBy === "ratingimdb"
      ? `?sortBy=ratingImdb`
      : `${
          context.query.sortBy === "title"
            ? `?sortBy=title`
            : `${context.query.sortBy === "views" ? `?sortBy=views` : ""}`
        }`
  }${
    context.query.ascOrDesc === "asc"
      ? `&ascOrDesc=asc`
      : `${context.query.ascOrDesc === "desc" ? `&ascOrDesc=desc` : ""}`
  } `;

  const res1 = await axios(url);
  const movies = res1.data;

  const res2 = await axios(`http://localhost:4000/latest`);
  const latestMovies = res2.data;

  const res3 = await axios(`http://localhost:4000/movie-count`);
  const moviesCount = res3.data;

  const moviePayload = {
    title: context.query.search
      ? context.query.search
      : "iewhfewoifhewfioeoijfewoifjewijfijewof",
    page: context.query.page ? context.query.page : "1",
  };

  const res4 = await axios.post(`http://localhost:4000/search`, moviePayload);
  const searchedMovies = res4.data;

  return {
    props: { movies, latestMovies, moviesCount, searchedMovies },
  };
}

export default function Home(
  {
    movies,
    latestMovies,
    moviesCount,
    searchedMovies,
  }
) {
  const router = useRouter();

  // const { data, error } = useSwr("/api/movies", fetcher);

  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  let pagesVisited = pageNumber * itemsPerPage;
  let pageCount;

  if (router.query.search)
    pageCount = Math.ceil(searchedMovies.count / itemsPerPage);
  else pageCount = Math.ceil(moviesCount.count / itemsPerPage);

  function handleChangingPageNumber(selected) {
    setPageNumber(selected);
  }

  const changePage = ({ selected }) => {
    handleChangingPageNumber(selected);
    if (
      router.query.sortBy === undefined &&
      router.query.ascOrDesc === undefined
    )
      router.push(`/?page=${selected + 1}`);

    if (
      router.query.sortBy === undefined &&
      router.query.ascOrDesc === undefined &&
      router.query.search
    )
      router.push(`/?page=${selected + 1}&search=${router.query.search}`);

    if (router.query.sortBy && router.query.ascOrDesc === undefined)
      router.push(`/?page=${selected + 1}&sortBy=${router.query.sortBy}`);

    if (router.query.sortBy === undefined && router.query.ascOrDesc)
      router.push(`/?page=${selected + 1}&ascOrDesc=${router.query.ascOrDesc}`);

    if (router.query.sortBy && router.query.ascOrDesc)
      router.push(
        `/?page=${selected + 1}&sortBy=${router.query.sortBy}&ascOrDesc=${
          router.query.ascOrDesc
        }`
      );
  };

  function getImages() {
    let images = [];

    if (movies.length !== 0 && movies[0].title !== undefined) {
      return (images = [
        { source: movies[0]?.photoSrc },
        { source: movies[1]?.photoSrc },
        { source: movies[2]?.photoSrc },
        { source: movies[3]?.photoSrc },
        { source: movies[4]?.photoSrc },
      ]);
    }
  }

  if (movies?.length === 0) {
    return (
      <div className={styles["home-wrapper-menus"]}>
        <div className={styles["home-ribbon-2"]}>
          <div className={styles["no-search"]}>
            <span>No Search Result or the array is getting populated.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles["home-wrapper-menus"]}>
        <Header />
        <div className={styles["home-ribbon-1"]}>
          <Carousel views={getImages()} />
        </div>

        <div className={styles["home-ribbon-2"]}>
          {/* <span className={styles["movie-count-span"]}>
              Total movies: {moviesCountSearch}{" "}
            </span> */}

          <span className={styles["movie-count-span"]}>
            Total movies: {moviesCount?.count}
          </span>

          <h3>Sort By: </h3>

          <ul className={styles["list-sort"]}>
            <Link
              href={`/?page=${
                router.query.page !== 1 ? "1" : router.query.page
              }&sortBy=views&ascOrDesc=desc`}
            >
              Most viewed (Desc)
            </Link>
            <Link
              href={`/?page=${
                router.query.page !== 1 ? "1" : router.query.page
              }&sortBy=ratingimdb&ascOrDesc=desc`}
            >
              Imdb rating (Desc)
            </Link>
            <Link
              href={`/?page=${
                router.query.page !== 1 ? "1" : router.query.page
              }&sortBy=title&ascOrDesc=desc`}
            >
              Title (Desc)
            </Link>
          </ul>

          {movies.length !== 0 && searchedMovies.movies.length === 0 ? (
            <div className={styles["image-ribbon-2-wrapper"]}>
              {movies.map((movie) => (
                <div
                  className={styles["movie-item"]}
                  key={movie.id}
                  onClick={function (e) {
                    e.stopPropagation();
                    router.push(
                      `movie/${movie.title
                        .split("")
                        .map((char) => (char === " " ? "-" : char))
                        .join("")}`
                    );
                  }}
                >
                  <img src={movie.photoSrc} />
                  <span className={styles["movie-title"]}>{movie.title}</span>

                  <div className={styles["genres-holder-span"]}>
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.genre.name}
                        onClick={function (e) {
                          e.stopPropagation();
                          router.push(`genres/${genre.genre.name}`);
                        }}
                      >
                        {genre.genre.name}
                      </span>
                    ))}
                  </div>

                  <span className={styles["imdb-span"]}>
                    {movie.ratingImdb !== 0
                      ? "Imdb: " + movie.ratingImdb
                      : "Imdb: " + "N/A"}
                  </span>
                </div>
              ))}
            </div>
          ) : searchedMovies.length !== 0 ? (
            <div className={styles["image-ribbon-2-wrapper"]}>
              {searchedMovies.movies.map((movie) => (
                <div
                  className={styles["movie-item"]}
                  key={movie.id}
                  onClick={function (e) {
                    e.stopPropagation();
                    router.push(
                      `movie/${movie.title
                        .split("")
                        .map((char) => (char === " " ? "-" : char))
                        .join("")}`
                    );
                  }}
                >
                  <img src={movie.photoSrc} />
                  <span className={styles["movie-title"]}>{movie.title}</span>

                  <div className={styles["genres-holder-span"]}>
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.genre.name}
                        onClick={function (e) {
                          e.stopPropagation();
                          router.push(`genres/${genre.genre.name}`);
                        }}
                      >
                        {genre.genre.name}
                      </span>
                    ))}
                  </div>

                  <span className={styles["imdb-span"]}>
                    {movie.ratingImdb !== 0
                      ? "Imdb: " + movie.ratingImdb
                      : "Imdb: " + "N/A"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles["no-search"]}>
              <span>No Search Result, no movie found with that criteria.</span>
            </div>
          )}

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

        {movies?.length !== 0 ? (
          <div className={styles["home-ribbon-3"]}>
            <ul className={styles["list-latest"]}>
              <li className={styles["special-last"]}>LATEST MOVIES</li>
            </ul>

            <div className={styles["image-ribbon-3-wrapper"]}>
              {latestMovies?.map((latestMovie) => (
                <div
                  className={styles["movie-item-latest"]}
                  key={latestMovie.id}
                  onClick={function (e) {
                    e.stopPropagation();
                    router.push(
                      `/movie/${latestMovie.title
                        .split("")
                        .map((char) => (char === " " ? "-" : char))
                        .join("")}`
                    );
                  }}
                >
                  <img src={latestMovie.photoSrc} />
                  <span className={styles["movie-title"]}>
                    {latestMovie.title}
                  </span>

                  <div className={styles["genres-holder-span"]}>
                    {latestMovie.genres.map((genre) => (
                      <span
                        key={genre.genre.name}
                        onClick={function (e) {
                          e.stopPropagation();
                          router.push(`/genres/${genre.genre.name}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        {genre.genre.name}
                      </span>
                    ))}
                  </div>

                  <span className={styles["imdb-span"]}>
                    {latestMovie.ratingImdb !== 0
                      ? "Imdb: " + latestMovie.ratingImdb
                      : null}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <Footer />
    </>
  );
}
