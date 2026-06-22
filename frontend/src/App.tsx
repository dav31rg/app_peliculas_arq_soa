import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { MovieDetail } from './pages/MovieDetail'
import { SearchResults } from './pages/SearchResults'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:imdbId" element={<MovieDetail />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </BrowserRouter>
  )
}
