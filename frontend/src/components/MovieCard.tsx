import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Movie } from '../services/api'

interface Props {
  movie: Movie
}

export function MovieCard({ movie }: Props) {
  const navigate = useNavigate()

  return (
    <motion.div
      className="flex-shrink-0 w-40 md:w-48 cursor-pointer relative group"
      whileHover={{ scale: 1.06, zIndex: 10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => navigate(`/movie/${movie.imdbID}`)}
    >
      {/* Poster */}
      <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-disney-card">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-xs text-center p-2">
            {movie.title}
          </div>
        )}

        {/* Overlay al hover */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-2"
          style={{ background: 'linear-gradient(to top, rgba(4,7,20,0.95) 0%, transparent 60%)' }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{movie.title}</p>
          <div className="flex items-center gap-1 mt-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#f5c518">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-yellow-400 text-[10px] font-bold">{movie.imdbRating}</span>
            <span className="text-gray-400 text-[10px] ml-1">{movie.year}</span>
          </div>
        </motion.div>
      </div>

      {/* Info bajo el poster */}
      <p className="mt-1.5 text-xs text-gray-300 truncate font-medium">{movie.title}</p>
      <p className="text-[10px] text-gray-500">{movie.year}</p>
    </motion.div>
  )
}
