import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { GameDocument } from './game.schema';
import { GameDto } from './games.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // Método GET para obtener todos los juegos
  @Get()
  async getGames(@Query('page') page = 1, @Query('limit') limit = 10) {
    const games = await this.gamesService.findAll(Number(page), Number(limit));
    return games;
  }

  // Método POST para crear un nuevo juego
  @Post()
  async create(@Body() createGameDto: GameDto): Promise<GameDocument> {
    return this.gamesService.create(createGameDto);
  }

  // Endpoint para sincronizar los juegos desde la API
  @Get('sync')
  async syncGames(): Promise<string> {
    try {
      await this.gamesService.syncGames();  // Llamar al servicio de sincronización
      return 'Sincronización completada con éxito';
    } catch (error) {
      console.error('Error en la sincronización:', error);
      return 'Hubo un error en la sincronización';
    }
  }

  // Método GET para obtener un juego por su ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GameDocument> {
    return this.gamesService.findOne(id);
  }
}

