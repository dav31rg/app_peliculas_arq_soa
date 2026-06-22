import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('recommendations')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':imdbId')
  getRecommendations(@Param('imdbId') imdbId: string) {
    return this.appService.getRecommendations(imdbId);
  }
}
