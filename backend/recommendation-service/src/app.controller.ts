import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('recomendations')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getRecomendation(@Param('id') id: string) {
    return this.appService.getRecomendation(Number(id));
  }
}
