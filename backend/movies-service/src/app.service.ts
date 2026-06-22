import { Injectable } from '@nestjs/common';
import { Movie } from './contracts/movie.interface';
import { MOVIES } from './data/movies.data';

@Injectable()
export class AppService {
  getMovies(): Movie[] {
    return MOVIES;
  }

  getMovie(id: number): Movie | undefined {
    return MOVIES.find((movie) => movie.id === id);
  }
}
