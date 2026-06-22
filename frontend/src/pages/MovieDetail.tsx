import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api, type MovieFull } from '../services/api'
import { ServiceBadge } from '../components/ServiceBadge'
import { MovieCarousel } from '../components/MovieCarousel'
import type { Movie } from '../services/api'

export function MovieDetail() {
  const { imdbId } = useParams<{ imdbId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<MovieFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!imdbId) return
    setLoading(true)
    setData(null)
    api.getMovieFull(imdbId)
      .then(setData)
      .catch(() => setError('Película no encontrada'))
      .finally(() => setLoading(false))
  }, [imdbId])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-8">
        <div className="skeleton h-96 w-full rounded-xl mb-6" />
        <div className="skeleton h-10 w-1/2 rounded mb-4" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-4/5 rounded" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">{error ?? 'Error desconocido'}</p>
      </div>
    )
  }

  const { movie, rating, recommendations, _sources } = data
  const recMovies: Movie[] = recommendations?.recommendations?.map(r => ({
    imdbID: r.imdbID, title: r.title, year: r.year, poster: r.poster,
    genre: r.genre, imdbRating: r.imdbRating,
    director: '', actors: '', plot: '', runtime: '', rated: '', boxOffice: '', awards: '',
  })) ?? []

  return (
    <motion.div
      className="min-h-screen bg-disney-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero backdrop */}
      <div className="relative h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${movie.poster})`, filter: 'blur(2px)' }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(4,7,20,0.97) 0%, rgba(4,7,20,0.5) 70%, transparent 100%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(4,7,20,1) 0%, transparent 50%)' }} />

        {/* Contenido hero */}
        <div className="relative z-10 h-full flex items-end px-8 md:px-16 pb-12">
          <div className="flex gap-8 items-end">
            {/* Poster */}
            <motion.img
              src={movie.poster}
              alt={movie.title}
              className="hidden md:block w-44 rounded-xl shadow-2xl flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Source badge */}
              <div className="mb-2">
                <ServiceBadge service={_sources.movie} />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
                <span>{movie.year}</span>
                <span>·</span>
                <span>{movie.runtime}</span>
                <span>·</span>
                <span>{movie.rated}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre.split(', ').map(g => (
                  <span key={g} className="text-xs px-2 py-0.5 rounded-full border border-gray-600 text-gray-300">{g}</span>
                ))}
              </div>
              <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Volver
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Detalle */}
      <div className="px-8 md:px-16 py-8 max-w-5xl">
        {/* Sinopsis */}
        <section className="mb-8">
          <h2 className="text-white font-bold text-lg mb-2">Sinopsis</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{movie.plot}</p>
        </section>

        {/* Ratings */}
        {rating && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-white font-bold text-lg">Puntuaciones</h2>
              <ServiceBadge service={_sources.rating} />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="bg-disney-card rounded-xl px-5 py-4 flex flex-col items-center min-w-[100px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f5c518" className="mb-1">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-yellow-400 text-2xl font-bold">{rating.imdbRating}</span>
                <span className="text-gray-500 text-xs mt-0.5">IMDb</span>
              </div>
              {rating.rottenTomatoes !== 'N/A' && (
                <div className="bg-disney-card rounded-xl px-5 py-4 flex flex-col items-center min-w-[100px]">
                  <span className="text-2xl mb-1">🍅</span>
                  <span className="text-red-400 text-2xl font-bold">{rating.rottenTomatoes}</span>
                  <span className="text-gray-500 text-xs mt-0.5">Rotten Tomatoes</span>
                </div>
              )}
              {rating.metacritic !== 'N/A' && (
                <div className="bg-disney-card rounded-xl px-5 py-4 flex flex-col items-center min-w-[100px]">
                  <span className="text-2xl mb-1">🎬</span>
                  <span className="text-green-400 text-2xl font-bold">{rating.metacritic}</span>
                  <span className="text-gray-500 text-xs mt-0.5">Metacritic</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Ficha técnica */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block text-xs uppercase tracking-wider mb-0.5">Director</span>
            <span className="text-gray-200">{movie.director}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs uppercase tracking-wider mb-0.5">Reparto</span>
            <span className="text-gray-200">{movie.actors}</span>
          </div>
          {movie.boxOffice && movie.boxOffice !== 'N/A' && (
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wider mb-0.5">Taquilla</span>
              <span className="text-gray-200">{movie.boxOffice}</span>
            </div>
          )}
          {movie.awards && movie.awards !== 'N/A' && (
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wider mb-0.5">Premios</span>
              <span className="text-gray-200">{movie.awards}</span>
            </div>
          )}
        </section>
      </div>

      {/* Recomendaciones */}
      {recMovies.length > 0 && (
        <div className="mt-4 pb-16">
          <div className="px-8 flex items-center gap-3 mb-1">
            <h2 className="text-white font-bold text-lg">Te puede gustar</h2>
            <ServiceBadge service={_sources.recommendations} />
          </div>
          <MovieCarousel label="" movies={recMovies} />
        </div>
      )}
    </motion.div>
  )
}
