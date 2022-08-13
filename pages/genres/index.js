import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../../styles/Genres.module.css";

// export async function getStaticProps() {
//   const res = await axios(`http://localhost:4000/genres`);
//   const genres = res.data;

//   return {
//     props: { genres },
//   };
// }

export async function getServerSideProps() {
  const res = await axios(`http://localhost:4000/genres`);
  const genres = res.data;

  return {
    props: { genres },
  };
}

export default function GenreCategoriesPage({ genres }) {
  const router = useRouter();

  return (
    <>
      <div className={styles["genre-categories-menus"]}>
        <Header />
        <h2>Choose your favorite genre</h2>

        <div className={styles["genre-categories-wrapper"]}>
          {genres?.map((genre) => (
            <div
              className={styles["genre-category"]}
              key={genre.id}
              onClick={function () {
                router.push(`/genres/${genre.name}`);
              }}
            >
              <span>{genre.name}</span>
            </div>
          ))}
        </div>
        {/* <Footer /> */}
      </div>
      <Footer />
    </>
  );
}
