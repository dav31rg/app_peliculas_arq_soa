import { Injectable, OnModuleInit, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Movie, MovieCategory } from './contracts/movie.interface';

const OMDB_KEY = '36d9d20a';
const OMDB_URL = 'http://www.omdbapi.com';

// Catálogo curado por categoría — IMDb IDs
const CATALOG: Record<string, { label: string; ids: string[] }> = {
  featured: {
    label: 'Destacadas',
    ids: ['tt0468569', 'tt1375666', 'tt0816692', 'tt4154796', 'tt0111161'],
  },
  action: {
    label: 'Acción',
    ids: ['tt0468569', 'tt1375666', 'tt4154796', 'tt3498820', 'tt0800369', 'tt2395427', 'tt0209144'],
  },
  drama: {
    label: 'Drama',
    ids: ['tt0111161', 'tt0068646', 'tt0071562', 'tt0108052', 'tt0167260', 'tt0120689'],
  },
  scifi: {
    label: 'Ciencia Ficción',
    ids: ['tt0133093', 'tt0816692', 'tt0062622', 'tt0083658', 'tt0118715'],
  },
  animation: {
    label: 'Animación',
    ids: ['tt0266543', 'tt0435761', 'tt1049413', 'tt0382932', 'tt0910970', 'tt2096673'],
  },
  thriller: {
    label: 'Thriller',
    ids: ['tt0482571', 'tt0137523', 'tt0114369', 'tt0056172'],
  },
};

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private cache = new Map<string, Movie>();

  async onModuleInit() {
    const allIds = [...new Set(Object.values(CATALOG).flatMap(c => c.ids))];
    this.logger.log(`Fetching ${allIds.length} movies from OMDB...`);
    await Promise.all(allIds.map(id => this.fetchAndCache(id)));
    this.logger.log(`Cache ready: ${this.cache.size} movies loaded.`);
  }

  private async fetchAndCache(imdbId: string): Promise<void> {
    try {
      const { data } = await axios.get(OMDB_URL, {
        params: { apikey: OMDB_KEY, i: imdbId, plot: 'full' },
      });
      if (data.Response === 'True') {
        this.cache.set(imdbId, this.normalize(data));
      }
    } catch (e) {
      this.logger.warn(`Failed to fetch ${imdbId}: ${e.message}`);
    }
  }

  private normalize(raw: Record<string, string>): Movie {
    return {
      imdbID: raw.imdbID,
      title: raw.Title,
      year: raw.Year,
      genre: raw.Genre,
      director: raw.Director,
      actors: raw.Actors,
      plot: raw.Plot,
      poster: raw.Poster !== 'N/A' ? raw.Poster : '',
      imdbRating: raw.imdbRating,
      runtime: raw.Runtime,
      rated: raw.Rated,
      boxOffice: raw.BoxOffice,
      awards: raw.Awards,
    };
  }

  getCategories(): MovieCategory[] {
    return Object.entries(CATALOG).map(([category, { label, ids }]) => ({
      category,
      label,
      movies: ids.map(id => this.cache.get(id)).filter(Boolean) as Movie[],
    }));
  }

  getMovie(imdbId: string): Movie {
    const movie = this.cache.get(imdbId);
    if (!movie) throw new NotFoundException(`Movie ${imdbId} not found`);
    return movie;
  }

  async search(query: string): Promise<Movie[]> {
    const { data } = await axios.get(OMDB_URL, {
      params: { apikey: OMDB_KEY, s: query, type: 'movie' },
    });
    if (!data.Search) return [];

    const results = await Promise.all(
      data.Search.slice(0, 8).map(async (r: { imdbID: string }) => {
        if (this.cache.has(r.imdbID)) return this.cache.get(r.imdbID);
        const { data: detail } = await axios.get(OMDB_URL, {
          params: { apikey: OMDB_KEY, i: r.imdbID, plot: 'short' },
        });
        return detail.Response === 'True' ? this.normalize(detail) : null;
      }),
    );
    return results.filter(Boolean) as Movie[];
  }
}
