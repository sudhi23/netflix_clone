import axios from "axios";

/** base url to make requests to the the movie database */
export default axios.create({
  baseURL: "https://api.themoviedb.org/3",
});
