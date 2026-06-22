import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api, type Movie } from '../services/api'
import { MovieCard } from '../components/MovieCard'
import { SkeletonCard } from '../components/SkeletonCard'

export function SearchResults() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    api.search(q)
      .then(setMovies)
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div className="min-h-screen pt-24 px-8 pb-16">
      <h1 className="text-2xl font-bold text-white mb-6">
        Resultados para: <span className="text-blue-400">"{q}"</span>
      </h1>
      <div className="flex flex-wrap gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.length === 0
            ? <p className="text-gray-500">No se encontraron resultados.</p>
            : movies.map((movie, i) => (
                <motion.div
                  key={movie.imdbID}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))
        }
      </div>
    </div>
  )
}
