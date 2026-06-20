import { Injectable } from '@nestjs/common';
import { Rating } from 'contracts/rating.interface';

@Injectable()
export class AppService {
  getRating(movieId: number): Rating {
    return {
      movieId,
      rating: 8.7,
    };
  }
}
