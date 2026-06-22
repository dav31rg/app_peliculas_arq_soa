import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Navbar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
    }
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
      style={{ background: 'linear-gradient(to bottom, rgba(4,7,20,0.95) 0%, transparent 100%)' }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-blue-500">
          <circle cx="16" cy="16" r="16" fill="#0063e5" />
          <path d="M8 20L16 8l8 12H8z" fill="white" />
        </svg>
        <span className="text-xl font-bold tracking-wide text-white">
          Cine<span className="text-blue-400">SOA</span>
        </span>
      </Link>

      {/* Links */}
      <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
        <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
        <Link to="/search?q=action" className="hover:text-white transition-colors">Acción</Link>
        <Link to="/search?q=drama" className="hover:text-white transition-colors">Drama</Link>
        <Link to="/search?q=animation" className="hover:text-white transition-colors">Animación</Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        {open && (
          <motion.form
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSearch}
          >
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar películas..."
              className="w-full bg-disney-card border border-gray-600 rounded-full px-4 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </motion.form>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="text-gray-300 hover:text-white transition-colors"
          aria-label="Buscar"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>
    </motion.nav>
  )
}
