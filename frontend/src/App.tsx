import { useEffect, useState } from "react";
import { getMoviesOverview, getMovieDetails } from "./services/esbApi";

interface MovieOverview {
  id: number;
  title: string;
  releaseDate: string;
  rating: number;
}

interface Recommendation {
  id: number;
  title: string;
}

interface MovieDetail {
  movie: {
    id: number;
    title: string;
    description: string;
    releaseDate: string;
  };
  rating: number;
  recommendations: Recommendation[];
}

function App() {
  const [movies, setMovies] = useState<MovieOverview[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await getMoviesOverview();
      setMovies(data);
    };

    loadMovies();
  }, []);

  const viewDetails = async (id: number) => {
    const data = await getMovieDetails(id);
    setSelectedMovie(data);
  };

  return (
    <div>
      <h1>Movie Catalog</h1>

      {selectedMovie && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
          <button onClick={() => setSelectedMovie(null)}>Close</button>

          <h2>{selectedMovie.movie.title}</h2>

          <p>⭐ {selectedMovie.rating}</p>

          <p>{selectedMovie.movie.description}</p>

          <p>Release Date: {selectedMovie.movie.releaseDate}</p>

          <h3>Recommendations</h3>

          <ul>
            {selectedMovie.recommendations.map((recommendation) => (
              <li key={recommendation.id}>{recommendation.title}</li>
            ))}
          </ul>
        </div>
      )}

      {movies.map((movie) => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>

          <p>⭐ {movie.rating}</p>

          <p>{movie.releaseDate}</p>

          <button onClick={() => viewDetails(movie.id)}>View Details</button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
