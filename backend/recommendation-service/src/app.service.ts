import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

const OMDB_KEY = '36d9d20a';
const OMDB_URL = 'http://www.omdbapi.com';

// Mapa de géneros a películas recomendadas
const GENRE_MAP: Record<string, string[]> = {
  Action:    ['tt0468569', 'tt1375666', 'tt4154796', 'tt3498820', 'tt0800369', 'tt2395427'],
  Drama:     ['tt0111161', 'tt0068646', 'tt0071562', 'tt0108052', 'tt0167260', 'tt0120689'],
  'Sci-Fi':  ['tt0133093', 'tt0816692', 'tt0062622', 'tt0083658'],
  Animation: ['tt0266543', 'tt0435761', 'tt1049413', 'tt0382932', 'tt0910970', 'tt2096673'],
  Thriller:  ['tt0482571', 'tt0137523', 'tt0114369'],
  Crime:     ['tt0068646', 'tt0071562', 'tt0468569', 'tt0114369'],
  Adventure: ['tt0266543', 'tt1375666', 'tt0816692', 'tt4154796'],
};

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async getRecommendations(imdbId: string) {
    this.logger.log(`Getting recommendations for ${imdbId}`);

    // Obtener género de la película desde OMDB
    const { data } = await axios.get(OMDB_URL, {
      params: { apikey: OMDB_KEY, i: imdbId },
    });

    if (data.Response === 'False') {
      return { forMovieId: imdbId, recommendations: [] };
    }

    const genres: string[] = data.Genre?.split(', ') ?? [];

    // Buscar películas recomendadas por género, excluyendo la actual
    const candidateIds = new Set<string>();
    for (const genre of genres) {
      for (const [key, ids] of Object.entries(GENRE_MAP)) {
        if (genre.includes(key) || key.includes(genre)) {
          ids.forEach(id => { if (id !== imdbId) candidateIds.add(id); });
        }
      }
    }

    // Fetchear detalles de los candidatos (máx 6)
    const idsToFetch = [...candidateIds].slice(0, 6);
    const movies = await Promise.all(
      idsToFetch.map(async id => {
        const { data: d } = await axios.get(OMDB_URL, {
          params: { apikey: OMDB_KEY, i: id },
        });
        if (d.Response === 'False') return null;
        return {
          imdbID: d.imdbID,
          title: d.Title,
          year: d.Year,
          poster: d.Poster !== 'N/A' ? d.Poster : '',
          genre: d.Genre,
          imdbRating: d.imdbRating,
        };
      }),
    );

    return {
      forMovieId: imdbId,
      recommendations: movies.filter(Boolean),
    };
  }
}
