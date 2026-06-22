import { useRef } from 'react'
import { motion } from 'framer-motion'
import { MovieCard } from './MovieCard'
import { SkeletonCard } from './SkeletonCard'
import type { Movie } from '../services/api'

interface Props {
  label: string
  movies: Movie[]
  loading?: boolean
}

export function MovieCarousel({ label, movies, loading }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
    }
  }

  return (
    <motion.section
      className="mb-8"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-lg font-bold text-white mb-3 px-8">{label}</h2>

      <div className="relative group/carousel">
        {/* Flecha izquierda */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/70 border border-gray-700 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-150 hover:bg-black"
          aria-label="Anterior"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Gradiente borde derecho */}
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #040714 0%, transparent 100%)' }} />
        <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #040714 0%, transparent 100%)' }} />

        {/* Scroll container */}
        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto carousel-scroll px-8 pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map(movie => (
                <div key={movie.imdbID} style={{ scrollSnapAlign: 'start' }}>
                  <MovieCard movie={movie} />
                </div>
              ))
          }
        </div>

        {/* Flecha derecha */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 border border-gray-700 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-150 hover:bg-black"
          aria-label="Siguiente"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </motion.section>
  )
}
