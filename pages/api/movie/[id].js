export default function userHandler(req, res) {
  
  const {
    method,
  } = req;

  switch (method) {
    case "GET":
      const { slug } = req.params;

  const slugSplitted = slug
    .split("")
    .map((char) => (char === "-" ? " " : char))
    .join("");

  const res1 = await axios(`http://localhost:4000/movie/${slugSplitted}`);
  const movie = res1.data;

  const res2 = await axios(`http://localhost:4000/latest`);
  const latestMovies = res2.data;

    const movieAll = { movie, latestMovies }
    res.status(200).json(movieAll)
      break;
    case "PUT":
      // Update or create data in your database
      // res.status(200).json({ id, name: name || `Movie ${id}` });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
