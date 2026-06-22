import MovieCard from './MovieCard';

export default function MovieList({ movies }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="movie-grid">
        <p className="empty-state">No hay peliculas disponibles.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
