import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';

const OMDB_KEY = '36d9d20a';
const OMDB_URL = 'http://www.omdbapi.com';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async getRating(imdbId: string) {
    this.logger.log(`Fetching rating for ${imdbId} from OMDB`);
    const { data } = await axios.get(OMDB_URL, {
      params: { apikey: OMDB_KEY, i: imdbId },
    });

    if (data.Response === 'False') {
      throw new NotFoundException(`Rating for ${imdbId} not found`);
    }

    const rt = data.Ratings?.find((r: { Source: string }) => r.Source === 'Rotten Tomatoes');
    const mc = data.Ratings?.find((r: { Source: string }) => r.Source === 'Metacritic');

    return {
      imdbID: imdbId,
      imdbRating: data.imdbRating,
      imdbVotes: data.imdbVotes,
      rottenTomatoes: rt?.Value ?? 'N/A',
      metacritic: mc?.Value ?? 'N/A',
    };
  }
}
