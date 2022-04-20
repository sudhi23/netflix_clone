import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import Youtube from "react-youtube";
import FlipMove from "react-flip-move";

import "./Row.css";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(fetchUrl);
      setMovies(response.data.results);
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "400px",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      if (movie.release_date) {
        axios
          .get(
            `/movie/${movie.id}/videos?api_key=f81980ff410e46f422d64ddf3a56dddd`
          )
          .then((res) => {
            res.data.results.map(
              (result) => result.type === "Trailer" && setTrailerUrl(result.key)
            );
          })
          .catch((err) => console.log(err));
      } else {
        axios
          .get(
            `/tv/${movie.id}/videos?api_key=f81980ff410e46f422d64ddf3a56dddd`
          )
          .then((res) => {
            console.log(res);
            res.data.results.map(
              (result) => result.type === "Trailer" && setTrailerUrl(result.key)
            );
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <FlipMove className="row__posters">
        {movies.map(
          (movie) =>
            ((isLargeRow && movie.poster_path) ||
              (!isLargeRow && movie.backdrop_path)) && (
              <img
                key={movie.id}
                onClick={handleClick.bind(this, movie)}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`${base_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
              />
            )
        )}
      </FlipMove>
      {trailerUrl && (
        <Youtube className="row__video" y videoId={trailerUrl} opts={opts} />
      )}
    </div>
  );
}

export default Row;
