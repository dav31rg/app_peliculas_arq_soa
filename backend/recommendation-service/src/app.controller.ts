import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('recommendations')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRecommendations() {
    return this.appService.getRecommendations();
  }

  @Get(':movieId')
  getRecommendation(@Param('movieId') movieId: string) {
    return this.appService.getRecommendation(Number(movieId));
  }
}
