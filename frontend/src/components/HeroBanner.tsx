import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SkeletonHero } from './SkeletonCard'
import type { Movie } from '../services/api'

interface Props {
  movies: Movie[]
  loading?: boolean
}

export function HeroBanner({ movies, loading }: Props) {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const current = movies[index]

  // Autoplay cada 7s
  useEffect(() => {
    if (movies.length < 2) return
    const id = setInterval(() => setIndex(i => (i + 1) % movies.length), 7000)
    return () => clearInterval(id)
  }, [movies.length])

  if (loading || !current) return <SkeletonHero />

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.imdbID}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Imagen de fondo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${current.poster})`, filter: 'blur(0px)' }}
          />
          {/* Overlay gradientes */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(4,7,20,0.92) 0%, rgba(4,7,20,0.3) 60%, transparent 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(4,7,20,1) 0%, transparent 40%)' }} />
        </motion.div>
      </AnimatePresence>

      {/* Contenido */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${current.imdbID}`}
          className="relative z-10 flex flex-col justify-end h-full px-8 md:px-16 pb-24 max-w-2xl"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          {/* Rating badge */}
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-yellow-400 text-sm font-bold">{current.imdbRating}</span>
            <span className="text-gray-400 text-sm">{current.year}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-400 text-sm">{current.runtime}</span>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
            {current.title}
          </h1>

          {/* Géneros */}
          <div className="flex flex-wrap gap-2 mb-4">
            {current.genre.split(', ').map(g => (
              <span key={g} className="text-xs px-2 py-0.5 rounded-full border border-gray-600 text-gray-300">
                {g}
              </span>
            ))}
          </div>

          {/* Sinopsis */}
          <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3 mb-6 max-w-lg">
            {current.plot}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate(`/movie/${current.imdbID}`)}
              className="flex items-center gap-2 bg-white text-disney-bg font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Ver detalles
            </motion.button>
            <button className="text-gray-300 text-sm hover:text-white transition-colors underline underline-offset-4">
              Más información
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicadores de slide */}
      <div className="absolute bottom-8 right-8 z-10 flex gap-2">
        {movies.map((m, i) => (
          <button
            key={m.imdbID}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-white w-6' : 'bg-gray-600'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
