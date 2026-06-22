import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('movies-overview')
  getMoviesOverview() {
    return this.appService.getMoviesOverview();
  }
  @Get('movie-details/:id')
  getMovieDetails(@Param('id') id: string) {
    return this.appService.getMovieDetails(Number(id));
  }
}
