import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('movies')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getCategories() {
    return this.appService.getCategories();
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.appService.search(q ?? '');
  }

  @Get(':imdbId')
  getMovie(@Param('imdbId') imdbId: string) {
    return this.appService.getMovie(imdbId);
  }
}
