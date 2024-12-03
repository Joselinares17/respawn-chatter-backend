import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs'; // Necesario para convertir Observable a Promesa
import { GameDocument } from './game.schema';
import { GameDto } from './games.dto';
import { Game } from './game.schema';  // Asegúrate de que el modelo de juego esté importado
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel('Game', 'gameReviews') private readonly gameModel: Model<GameDocument>,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  // Métodos CRUD existentes
  async create(createGameDto: GameDto): Promise<GameDocument> {
    const createdGame = new this.gameModel(createGameDto);
    return createdGame.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<any> {
    const skip = (page - 1) * limit;  // Calcular el valor de "skip" según la página
    const cachekey = `games:page:${page}:limit:${limit}`;

      // Intentar obtener los datos desde el caché
    const cachedData = await this.cacheService.getCache(cachekey);

    if (cachedData) {
      // Si los datos están en caché, devolverlos
      console.log('Datos de juegos desde caché');
      return cachedData;
    }
    
    
    const games = await this.gameModel.find().skip(skip).limit(limit).exec();
    const totalGames = await this.gameModel.countDocuments();  // Contamos todos los juegos

    const result = {
      games,
      totalPages: Math.ceil(totalGames / limit),  // Calculamos el total de páginas
      currentPage: page,
    };

    // Guardar los datos obtenidos en caché por 1 hora (3600 segundos)
    await this.cacheService.setCache(cachekey, result, 3600);
    return result;
  }

  async findOne(id: string): Promise<GameDocument> {
    const cacheKey = `game:${id}`;  // Clave única para cada juego usando el _id
    // Intentar obtener los datos desde el caché
    const cachedGame = await this.cacheService.getCache(cacheKey);

    if (cachedGame) {
      // Si el juego está en caché, devolverlo
      console.log('Juego desde caché');
      return cachedGame as GameDocument;
    }

      // Si no está en caché, obtener el juego desde la base de datos
      const game = await this.gameModel.findById(id).exec();

      if (!game) {
        throw new Error('Game not found');
      }

      // Guardar el juego en caché por 1 hora (3600 segundos)
      await this.cacheService.setCache(cacheKey, game, 3600);

      return game;
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
