import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';

const SERVICES = {
  movies: 'http://localhost:3001',
  ratings: 'http://localhost:3002',
  recommendations: 'http://localhost:3003',
};

@Injectable()
export class AppService {
  private readonly logger = new Logger('ESB-Gateway');

  async getCategories() {
    this.logger.log('[movies-service] GET /movies');
    const { data } = await axios.get(`${SERVICES.movies}/movies`);
    return data;
  }

  async search(q: string) {
    this.logger.log(`[movies-service] GET /movies/search?q=${q}`);
    const { data } = await axios.get(`${SERVICES.movies}/movies/search`, {
      params: { q },
    });
    return data;
  }

  async getMovieFull(imdbId: string) {
    this.logger.log(`[ESB] Aggregating movie ${imdbId} from 3 services`);

    const [movieRes, ratingRes, recRes] = await Promise.allSettled([
      axios.get(`${SERVICES.movies}/movies/${imdbId}`),
      axios.get(`${SERVICES.ratings}/ratings/${imdbId}`),
      axios.get(`${SERVICES.recommendations}/recommendations/${imdbId}`),
    ]);

    if (movieRes.status === 'rejected') {
      throw new NotFoundException(`Movie ${imdbId} not found`);
    }

    return {
      movie: movieRes.value.data,
      rating: ratingRes.status === 'fulfilled' ? ratingRes.value.data : null,
      recommendations: recRes.status === 'fulfilled' ? recRes.value.data : [],
      _sources: {
        movie: 'movies-service:3001',
        rating: 'rating-service:3002',
        recommendations: 'recommendation-service:3003',
      },
    };
  }
}
