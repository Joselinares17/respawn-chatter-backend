import { GameDto } from './games.dto';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Model } from 'mongoose';


describe('GamesController', () => {
  let gamesController: GamesController;
  let gamesService: GamesService;

  beforeEach(async () => {
    // Aquí crea una instancia de GamesService y GamesController
    gamesService = new GamesService(Model);
    gamesController = new GamesController(gamesService);
  });

  it('should create a new game', async () => {
    const createGameDto: GameDto = {
      title: 'Nuevo Juego',
      developer: 'Desarrollador X',
      releaseYear: 2024,
      platforms: ['PC', 'PlayStation 5'],
      genre: ['Acción', 'Aventura'],
      image: 'http://example.com/juego-imagen.jpg',
    };

    // Aquí el servicio debería devolver el documento completo
    const result = await gamesController.create(createGameDto);

    // Validación de la creación del juego
    expect(result).toEqual(createGameDto);
  });
});
