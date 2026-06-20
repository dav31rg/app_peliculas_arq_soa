import { Injectable } from '@nestjs/common';
import { Movie } from './contracts/movie.interface';

@Injectable()
export class AppService {
  getMovie(id: number): Movie {
    return {
      id,
      title: 'Movie 1',
      description: 'Movie 1 description',
      releaseDate: '2021-01-01',
    };
  }
}
