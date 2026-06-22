import { Recommendation } from '../contracts/recommendation.interface';

export const RECOMMENDATIONS: Recommendation[] = [
  { movieId: 1, recommendations: [2, 3, 5] },
  { movieId: 2, recommendations: [1, 4, 6] },
  { movieId: 3, recommendations: [1, 2, 7] },
  { movieId: 4, recommendations: [2, 8, 9] },
  { movieId: 5, recommendations: [1, 10, 18] },
  { movieId: 6, recommendations: [2, 7, 12] },
  { movieId: 7, recommendations: [6, 14, 17] },
  { movieId: 8, recommendations: [9, 10, 15] },
  { movieId: 9, recommendations: [8, 10, 11] },
  { movieId: 10, recommendations: [8, 9, 15] },
  { movieId: 11, recommendations: [15, 16, 13] },
  { movieId: 12, recommendations: [6, 19, 20] },
  { movieId: 13, recommendations: [11, 14, 16] },
  { movieId: 14, recommendations: [7, 13, 17] },
  { movieId: 15, recommendations: [10, 11, 16] },
  { movieId: 16, recommendations: [11, 13, 15] },
  { movieId: 17, recommendations: [7, 14, 18] },
  { movieId: 18, recommendations: [5, 17, 20] },
  { movieId: 19, recommendations: [12, 18, 20] },
  { movieId: 20, recommendations: [12, 18, 19] },
];
