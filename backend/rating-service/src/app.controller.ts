import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('ratings')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':imdbId')
  getRating(@Param('imdbId') imdbId: string) {
    return this.appService.getRating(imdbId);
  }
}
