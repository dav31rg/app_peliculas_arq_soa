import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('movies')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getMovie(@Param('id') id: string) {
    return this.appService.getMovie(Number(id));
  }
}
