import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly moviesServiceUrl = process.env.MOVIES_SERVICE_URL;
  private readonly ratingsServiceUrl = process.env.RATING_SERVICE_URL;
  private readonly recommendationsServiceUrl =
    process.env.RECOMMENDATION_SERVICE_URL;
  async getMoviesOverview() {
    const moviesResponse = await axios.get(`${this.moviesServiceUrl}/movies`);

    const movies = moviesResponse.data;

    const moviesWithRatings = await Promise.all(
      movies.map(async (movie: any) => {
        const ratingResponse = await axios.get(
          `${this.ratingsServiceUrl}/ratings/${movie.id}`,
        );

        return {
          id: movie.id,
          title: movie.title,
          releaseDate: movie.releaseDate,
          rating: ratingResponse.data.rating,
        };
      }),
    );
    return moviesWithRatings;
  }
  async getMovieDetails(id: number) {
    const [movieResponse, ratingResponse, recommendationResponse] =
      await Promise.all([
        axios.get(`${this.moviesServiceUrl}/movies/${id}`),
        axios.get(`${this.ratingsServiceUrl}/ratings/${id}`),
        axios.get(`${this.recommendationsServiceUrl}/recommendations/${id}`),
      ]);

    const recommendationIds = recommendationResponse.data.recommendations;

    const recommendations = await Promise.all(
      recommendationIds.map(async (movieId: number) => {
        const response = await axios.get(
          `${this.moviesServiceUrl}/movies/${movieId}`,
        );

        return {
          id: response.data.id,
          title: response.data.title,
        };
      }),
    );

    return {
      movie: movieResponse.data,
      rating: ratingResponse.data.rating,
      recommendations,
    };
  }
}
