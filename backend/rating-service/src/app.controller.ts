import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
@Controller('ratings')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRatings() {
    return this.appService.getRatings();
  }

  @Get(':movieId')
  getRating(@Param('movieId') movieId: string) {
    return this.appService.getRating(Number(movieId));
  }
}
