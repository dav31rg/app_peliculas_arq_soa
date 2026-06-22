const API_URL = 'http://localhost:3000';

export const getMoviesOverview = async () => {
  const response = await fetch(
    `${API_URL}/movies-overview`,
  );

  if (!response.ok) {
    throw new Error('Error loading movies');
  }

  return response.json();
};

export const getMovieDetails = async (id: number) => {
  const response = await fetch(
    `${API_URL}/movie-details/${id}`,
  );

  if (!response.ok) {
    throw new Error('Error loading movie details');
  }

  return response.json();
};