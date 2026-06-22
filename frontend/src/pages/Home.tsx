import { useEffect, useState } from 'react'
import { HeroBanner } from '../components/HeroBanner'
import { MovieCarousel } from '../components/MovieCarousel'
import { api, type MovieCategory } from '../services/api'

export function Home() {
  const [categories, setCategories] = useState<MovieCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.getCategories()
      .then(data => setCategories(data))
      .catch(() => setError('No se pudo conectar al ESB Gateway (puerto 3000)'))
      .finally(() => setLoading(false))
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">{error}</p>
          <p className="text-gray-500 text-sm">Asegúrate de que el ESB Gateway esté corriendo en el puerto 3000</p>
        </div>
      </div>
    )
  }

  const featured = categories.find(c => c.category === 'featured')
  const rest = categories.filter(c => c.category !== 'featured')

  return (
    <div className="min-h-screen bg-disney-bg">
      <HeroBanner movies={featured?.movies ?? []} loading={loading} />

      <div className="mt-4 pb-16">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <MovieCarousel key={i} label="" movies={[]} loading />
            ))
          : rest.map(cat => (
              <MovieCarousel key={cat.category} label={cat.label} movies={cat.movies} />
            ))
        }
      </div>
    </div>
  )
}
