import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Movie } from './contracts/movie.interface';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  private getHeaders() {
    return {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
    };
  }

  private normalizeMovie(data: any): Movie {
    return {
      id: data.id,
      title: data.title,
      overview: data.overview,
      posterPath: data.poster_path ?? null,
      releaseDate: data.release_date ?? '',
      voteAverage: data.vote_average ?? 0,
    };
  }

  async getNowPlaying(): Promise<Movie[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${TMDB_BASE_URL}/movie/now_playing`, {
          params: { language: 'en-US', page: 1 },
          headers: this.getHeaders(),
        }),
      );
      return data.results.map((movie: any) => this.normalizeMovie(movie));
    } catch (error) {
      throw new HttpException(
        error.response?.data?.status_message || 'Error fetching now playing movies',
        error.response?.status || 500,
      );
    }
  }
}
