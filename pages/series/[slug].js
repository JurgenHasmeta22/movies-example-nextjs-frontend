import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import styles from '../../styles/Genre.module.css'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export async function getServerSideProps(context) {
  const { slug } = context.params

  const slugSplitted = slug
    .split('')
    .map(char => (char === '-' ? ' ' : char))
    .join('')

  const res = await axios(
    `http://localhost:4000/series/${slugSplitted}?page=${context.query.page ? context.query.page : '1'}`
  )
  const serie = res.data.serial

  return {
    props: { serie }
  }
}

export default function SeriePage({ serie }) {
  const router = useRouter()
  const [pageNumber, setPageNumber] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  let pagesVisited = pageNumber * itemsPerPage
  const pageCount = Math.ceil(serie.episodes.length / itemsPerPage)

  function handleChangingPageNumber(selected) {
    setPageNumber(selected)
  }

  const changePage = ({ selected }) => {
    handleChangingPageNumber(selected)
    if (router.query.sortBy === undefined && router.query.ascOrDesc === undefined)
      router.push(`/series?page=${selected + 1}`)

    if (router.query.sortBy === undefined && router.query.ascOrDesc === undefined && router.query.search)
      router.push(`/series?page=${selected + 1}&search=${router.query.search}`)

    if (router.query.sortBy && router.query.ascOrDesc === undefined)
      router.push(`/series?page=${selected + 1}&sortBy=${router.query.sortBy}`)

    if (router.query.sortBy === undefined && router.query.ascOrDesc)
      router.push(`/series?page=${selected + 1}&ascOrDesc=${router.query.ascOrDesc}`)

    if (router.query.sortBy && router.query.ascOrDesc)
      router.push(`/series?page=${selected + 1}&sortBy=${router.query.sortBy}&ascOrDesc=${router.query.ascOrDesc}`)
  }

  return (
    <>
      <div className={styles['genre-wrapper-menus']}>
        <Header />
        <div className={styles['genre-ribbon-1']}>
          {/* <span className={styles['movie-count-span']}>Total series: {seriesCount.count} </span> */}

          <div className={styles['image-ribbon-1-genre-wrapper']}>
            {serie.episodes.map(episode => (
              <div
                className={styles['movie-item-genre']}
                key={episode.id}
                onClick={function (e) {
                  e.stopPropagation();
                  router.push(
                    `/seria/${episode.title
                      .split("")
                      .map((char) => (char === " " ? "-" : char))
                      .join("")}`
                  );
                }}
              >
                <img src={episode.photoSrc} />
                <span className={styles['movie-title']}>{episode.title}</span>

                {/* <span className={styles['imdb-span']}>
                  {serie.ratingImdb !== 0 ? 'Imdb: ' + serie.ratingImdb : 'Imdb: ' + 'N/A'}
                </span> */}
              </div>
            ))}
          </div>

          <ReactPaginate
            previousLabel={'< Previous'}
            nextLabel={'Next >'}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={styles['paginationBttns']}
            previousLinkClassName={styles['previousBttn']}
            nextLinkClassName={styles['nextBttn']}
            disabledClassName={styles['paginationDisabled']}
            activeClassName={styles['paginationActive']}
          />
        </div>
        <Footer />
      </div>
      <Footer />
    </>
  )
}
