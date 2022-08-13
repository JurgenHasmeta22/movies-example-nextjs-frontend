export default function handler(_req, res) {

    const url = `http://localhost:4000/movies/page/${
        req.query.page ? req.query.page : "1"
      }${
        req.query.sortBy === "ratingimdb"
          ? `?sortBy=ratingImdb`
          : `${
            req.query.sortBy === "title"
                ? `?sortBy=title`
                : `${req.query.sortBy === "views" ? `?sortBy=views` : ""}`
            }`
      }${
        context.query.ascOrDesc === "asc"
          ? `&ascOrDesc=asc`
          : `${req.query.ascOrDesc === "desc" ? `&ascOrDesc=desc` : ""}`
    } `;
    
    const res1 = await axios(url);
    const movies = res1.data;

    const res2 = await axios(`http://localhost:4000/latest`);
    const latestMovies = res2.data;

    const res3 = await axios(`http://localhost:4000/movie-count`);
    const moviesCount = res3.data;

    const moviePayload = {
        title: req.query.search
            ? req.query.search
            : "iewhfewoifhewfioeoijfewoifjewijfijewof",
        page: req.query.page ? req.query.page : "1",
    };

    const res4 = await axios.post(`http://localhost:4000/search`, moviePayload);
    const searchedMovies = res4.data;
    
    const allData =  { movies, latestMovies, moviesCount, searchedMovies }
    console.log(allData)
    res.status(200).json(allData)
}