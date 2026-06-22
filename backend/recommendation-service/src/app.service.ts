import { Injectable, NotFoundException } from '@nestjs/common';
import { Recommendation } from './contracts/recommendation.interface';
import { RECOMMENDATIONS } from './data/recommendations.data';

@Injectable()
export class AppService {
  getRecommendations(): Recommendation[] {
    return RECOMMENDATIONS;
  }

  getRecommendation(movieId: number): Recommendation {
    const recommendation = RECOMMENDATIONS.find(
      (recommendation) => recommendation.movieId === movieId,
    );

    if (!recommendation) {
      throw new NotFoundException(
        `Recommendations for movie ${movieId} not found`,
      );
    }

    return recommendation;
  }
}
