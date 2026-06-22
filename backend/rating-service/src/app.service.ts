import { Injectable, NotFoundException } from '@nestjs/common';
import { Rating } from './contracts/rating.interface';
import { RATINGS } from './data/ratings.data';

@Injectable()
export class AppService {
  getRatings(): Rating[] {
    return RATINGS;
  }

  getRating(movieId: number): Rating {
    const rating = RATINGS.find((rating) => rating.movieId === movieId);

    if (!rating) {
      throw new NotFoundException(`Rating for movie ${movieId} not found`);
    }

    return rating;
  }
}
