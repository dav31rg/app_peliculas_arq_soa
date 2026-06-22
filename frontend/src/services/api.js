const API_BASE = '/api';
const movieRequests = new Map();

export async function fetchMoviesByCategory(category) {
  const response = await fetch(`${API_BASE}/movies/${category}`);
  if (!response.ok) {
    throw new Error('Error fetching movies');
  }
  return response.json();
}

export function getMoviesPromise(category) {
  if (!movieRequests.has(category)) {
    movieRequests.set(category, fetchMoviesByCategory(category));
  }

  return movieRequests.get(category);
}
