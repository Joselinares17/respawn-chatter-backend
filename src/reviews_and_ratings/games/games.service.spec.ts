import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { getModelToken } from '@nestjs/mongoose';
import { Game } from './game.schema';
import { Model } from 'mongoose';

describe('GamesService', () => {
  let service: GamesService;
  let gameModel: Model<'Game'>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getModelToken(Game.name),
          useValue: {
            // Simulamos el modelo de Mongoose con un mock
            create: jest.fn().mockResolvedValue({
              title: 'Test Game',
              developer: 'Test Developer',
              releaseYear: 2023,
              genre: ['Action'],
              platforms: ['PC'],
              createdAt: new Date(),
              image: 'image-url',
            }),
            find: jest.fn().mockResolvedValue([]), // Mock para find()
            findById: jest.fn().mockResolvedValue(null), // Mock para findById()
          },
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    gameModel = module.get<Model<'Game'>>(getModelToken(Game.name));
  });

  it('should create a game', async () => {
    const gameDto = {
      title: 'Test Game',
      developer: 'Test Developer',
      releaseYear: 2023,
      genre: ['Action'],
      platforms: ['PC'],
      image: 'URL DE IMAGEN'
    };

    const createdGame = await service.create(gameDto);

    expect(createdGame.title).toBe(gameDto.title);
    expect(createdGame.developer).toBe(gameDto.developer);
    expect(createdGame.releaseYear).toBe(gameDto.releaseYear);
    expect(createdGame.genre).toBe(gameDto.genre);
    expect(createdGame.platforms).toBe(gameDto.platforms);
  });

  it('should find all games', async () => {
    const games = await service.findAll();
    expect(games).toEqual([]);
  });
});
