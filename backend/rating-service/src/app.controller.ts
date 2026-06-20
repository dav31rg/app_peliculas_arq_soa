import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('ratings')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getRating(@Param('id') id: string) {
    return this.appService.getRating(Number(id));
  }
}
