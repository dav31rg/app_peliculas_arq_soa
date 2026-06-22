import { startTransition, Suspense, use, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import MovieList from '../components/MovieList';
import { getMoviesPromise } from '../services/api';

const categories = [
  { id: 'popular', label: 'Populares' },
  { id: 'top-rated', label: 'Más Valoradas' },
  { id: 'now-playing', label: 'En Cartelera' },
];

export default function Home() {
  const [category, setCategory] = useState('popular');

  function handleCategoryChange(id) {
    startTransition(() => setCategory(id));
  }

  return (
    <section className="home">
      <div className="hero">
        <p className="eyebrow">Arquitectura SOA + WSO2</p>
        <h1>Peliculas TMDB</h1>
        <p className="hero-copy">
          Tres servicios registrados y consumidos desde un bus central.
        </p>
      </div>

      <nav className="category-tabs" aria-label="Categorias de peliculas">
        {categories.map(item => (
          <button
            key={item.id}
            className={`category-tab${category === item.id ? ' active' : ''}`}
            onClick={() => handleCategoryChange(item.id)}
            aria-pressed={category === item.id}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <ErrorBoundary resetKey={category}>
        <Suspense fallback={<MoviesSkeleton />}>
          <MovieSection category={category} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}

function MovieSection({ category }) {
  const movies = use(getMoviesPromise(category));
  return <MovieList movies={movies} />;
}

function MoviesSkeleton() {
  return (
    <div className="movie-grid" aria-label="Cargando peliculas">
      {Array.from({ length: 8 }).map((_, i) => (
        <div className="movie-card skeleton-card" key={i}>
          <div className="skeleton-block" />
          <div className="movie-card-body">
            <div className="skeleton-line wide" />
            <div className="skeleton-line" />
          </div>
        </div>
      ))}
    </div>
  );
}
