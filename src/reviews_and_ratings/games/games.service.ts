import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs'; // Necesario para convertir Observable a Promesa
import { GameDocument } from './game.schema';
import { GameDto } from './games.dto';
import { Game } from './game.schema';  // Asegúrate de que el modelo de juego esté importado

@Injectable()
export class GamesService {
  constructor(
    @InjectModel('Game', 'gameReviews') private readonly gameModel: Model<GameDocument>,
    private readonly httpService: HttpService,
  ) {}

  // Métodos CRUD existentes
  async create(createGameDto: GameDto): Promise<GameDocument> {
    const createdGame = new this.gameModel(createGameDto);
    return createdGame.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<any> {
    const skip = (page - 1) * limit;  // Calcular el valor de "skip" según la página
    const games = await this.gameModel.find().skip(skip).limit(limit).exec();
    const totalGames = await this.gameModel.countDocuments();  // Contamos todos los juegos

    return {
      games,
      totalPages: Math.ceil(totalGames / limit),  // Calculamos el total de páginas
      currentPage: page,
    };
  }

  async findOne(id: string): Promise<GameDocument> {
    return this.gameModel.findById(id).exec();
  }

  // Nuevo método para sincronizar los juegos desde la API
  async syncGames(): Promise<void> {
    try {
      console.log('Iniciando la sincronización de juegos');
      const response = await lastValueFrom(this.httpService.get('https://api.rawg.io/api/games?key=b12b37ca07da4b0885e6e501e3e8fe76'));
      const games = response.data.results;  // Suponiendo que la respuesta tiene una propiedad 'results'

      // Guardamos los juegos en la base de datos
      await this.saveGamesToDatabase(games);
      console.log(`Sincronización completada, juegos guardados: ${games.length}`);
    } catch (error) {
      console.error('Error al sincronizar juegos:', error);
    }
  }

  // Función interna para guardar los juegos en la base de datos
  private async saveGamesToDatabase(games: any[]): Promise<void> {
    try {
      await this.gameModel.insertMany(games);  // Insertar múltiples juegos en la base de datos
      console.log(`Juegos guardados: ${games.length}`);
    } catch (error) {
      console.error('Error al guardar juegos en la base de datos:', error);
    }
  }
}
