const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      {movie.posterPath ? (
        <img
          className="movie-poster"
          src={`${TMDB_IMG_BASE}${movie.posterPath}`}
          alt={movie.title}
          loading="lazy"
        />
      ) : (
        <div className="poster-placeholder">
          <span>Sin imagen</span>
        </div>
      )}

      <div className="movie-card-body">
        <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
        <div className="movie-meta">
          <span className="movie-date">
            {movie.releaseDate ? movie.releaseDate.split('-')[0] : '—'}
          </span>
          <span className="movie-rating">{movie.voteAverage?.toFixed(1) || '—'}</span>
        </div>
      </div>
    </article>
  );
}
