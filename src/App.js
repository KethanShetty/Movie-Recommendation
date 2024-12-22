// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";

const TMDB_API_KEY = "2cec53da8cc3ae5c6e88da965f640fcd"; // Replace with your API key
const TMDB_API_URL = "https://api.themoviedb.org/3";

function App() {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]); // Store all movies for filtering
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("popularity.desc"); // Default sort option

  useEffect(() => {
    fetchPopularMovies();
    fetchGenres();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      const response = await fetch(`${TMDB_API_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      setMovies(data.results);
      setAllMovies(data.results); // Store all movies for filtering
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${TMDB_API_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const searchMovies = async () => {
    if (query.trim() !== "") {
      try {
        const response = await fetch(`${TMDB_API_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${query}`);
        const data = await response.json();
        const movieResults = data.results.filter((result) => result.media_type === "movie");
        const personResults = data.results.filter((result) => result.media_type === "person");

        if (personResults.length > 0) {
          fetchMoviesByPerson(personResults[0].id);
        } else {
          setMovies(movieResults.length > 0 ? movieResults : []);
          setAllMovies(movieResults.length > 0 ? movieResults : []); // Store search results for filtering
          setSelectedGenre(""); // Reset genre selection on new search
        }
      } catch (error) {
        console.error("Error fetching movies or persons:", error);
      }
    }
  };

  const fetchMoviesByPerson = async (personId) => {
    try {
      const response = await fetch(`${TMDB_API_URL}/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      setMovies(data.cast.length > 0 ? data.cast : []);
      setAllMovies(data.cast.length > 0 ? data.cast : []); // Store person movies for filtering
    } catch (error) {
      console.error("Error fetching movies by person:", error);
    }
  };

  const filterByGenre = () => {
    if (selectedGenre) {
      const filteredMovies = allMovies.filter(movie => movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre)));
      setMovies(filteredMovies);
    } else {
      // If no genre is selected, reset to the original movies list
      setMovies(allMovies);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchMovies();
    }
  };

  const sortMovies = () => {
    const sortedMovies = [...movies].sort((a, b) => {
      switch (sortOption) {
        case "popularity.desc":
          return b.popularity - a.popularity;
        case "popularity.asc":
          return a.popularity - b.popularity;
        case "release_date.desc":
          return new Date(b.release_date) - new Date(a.release_date);
        case "release_date.asc":
          return new Date(a.release_date) - new Date(b.release_date);
        case "vote_average.desc":
          return b.vote_average - a.vote_average;
        case "vote_average.asc":
          return a.vote_average - b.vote_average;
        default:
          return 0;
      }
    });
    setMovies(sortedMovies );
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Movie Explorer</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress} // Add key press handler
          />
          <button onClick={searchMovies}>Search</button>
        </div>
        <div className="filter">
          <select onChange={(e) => setSelectedGenre(e.target.value)} value={selectedGenre}>
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          <button onClick={filterByGenre}>Filter</button>
        </div>
        <div className="sort">
          <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
            <option value="popularity.desc">Sort by Popularity (Desc)</option>
            <option value="popularity.asc">Sort by Popularity (Asc)</option>
            <option value="release_date.desc">Sort by Release Date (Desc)</option>
            <option value="release_date.asc">Sort by Release Date (Asc)</option>
            <option value="vote_average.desc">Sort by Rating (Desc)</option>
            <option value="vote_average.asc">Sort by Rating (Asc)</option>
          </select>
          <button onClick={sortMovies}>Sort</button>
        </div>
      </header>
      <main>
        <h2>Recommended Movies</h2>
        <div className="movie-list">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
                <p>Release Date: {movie.release_date}</p>
                <p>Rating: {movie.vote_average}</p>
              </div>
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;