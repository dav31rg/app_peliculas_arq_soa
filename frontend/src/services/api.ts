import axios from 'axios'

const http = axios.create({ baseURL: '/api' })

export interface Movie {
  imdbID: string
  title: string
  year: string
  genre: string
  director: string
  actors: string
  plot: string
  poster: string
  imdbRating: string
  runtime: string
  rated: string
  boxOffice: string
  awards: string
}

export interface MovieCategory {
  category: string
  label: string
  movies: Movie[]
}

export interface Rating {
  imdbID: string
  imdbRating: string
  imdbVotes: string
  rottenTomatoes: string
  metacritic: string
}

export interface RecommendedMovie {
  imdbID: string
  title: string
  year: string
  poster: string
  genre: string
  imdbRating: string
}

export interface MovieFull {
  movie: Movie
  rating: Rating | null
  recommendations: { forMovieId: string; recommendations: RecommendedMovie[] }
  _sources: { movie: string; rating: string; recommendations: string }
}

export const api = {
  getCategories: (): Promise<MovieCategory[]> =>
    http.get('/movies').then(r => r.data),

  search: (q: string): Promise<Movie[]> =>
    http.get('/movies/search', { params: { q } }).then(r => r.data),

  getMovieFull: (imdbId: string): Promise<MovieFull> =>
    http.get(`/movies/${imdbId}`).then(r => r.data),
}
