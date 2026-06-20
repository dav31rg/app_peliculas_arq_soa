import { Injectable } from '@nestjs/common';
import { Recommendation } from './contracts/recommendation.interface';

@Injectable()
export class AppService {
  getRecomendation(movieId: number): Recommendation {
    return {
      movieId,
      recommendedMovie: 'Movie 12',
    };
  }
}
