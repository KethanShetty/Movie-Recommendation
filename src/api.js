// src/api.js
const TMDB_API_KEY = "2cec53da8cc3ae5c6e88da965f640fcd"; // Replace with your API key
const TMDB_API_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async () => {
  const response = await fetch(`${TMDB_API_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const fetchGenres = async () => {
  const response = await fetch(`${TMDB_API_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
  const data = await response.json();
  return data.genres;
};

export const searchMovies = async (query) => {
  const response = await fetch(`${TMDB_API_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${query}`);
  const data = await response.json();
  return data.results;
};

export const fetchMoviesByPerson = async (personId) => {
  const response = await fetch(`${TMDB_API_URL}/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`);
  const data = await response.json();
  return data.cast;
};

export const fetchMoviesByGenre = async (genreId) => {
  const response = await fetch(`${TMDB_API_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`);
  const data = await response.json();
  return data.results;
};