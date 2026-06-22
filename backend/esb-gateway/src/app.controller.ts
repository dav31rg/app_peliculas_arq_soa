import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** GET /movies  — lista todas las categorías */
  @Get('movies')
  getCategories() {
    return this.appService.getCategories();
  }

  /** GET /search?q=  — búsqueda (ruta separada, sin conflicto con :imdbId) */
  @Get('search')
  search(@Query('q') q: string) {
    return this.appService.search(q ?? '');
  }

  /** GET /movies/:imdbId  — detalle completo agregado (movie + rating + recs) */
  @Get('movies/:imdbId')
  getMovieFull(@Param('imdbId') imdbId: string) {
    return this.appService.getMovieFull(imdbId);
  }
}
