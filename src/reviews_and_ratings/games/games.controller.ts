import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GamesService } from './games.service';
import { GameDocument } from './game.schema';
import { GameDto } from './games.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async findAll(): Promise<GameDocument[]> {
    return this.gamesService.findAll();
  }

  @Post()
  async create(@Body() createGameDto: GameDto): Promise<GameDocument> {
    return this.gamesService.create(createGameDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GameDocument> {
    return this.gamesService.findOne(id);
  }
}
