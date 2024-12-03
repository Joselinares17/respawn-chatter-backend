import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GamesService } from './games.service';
import { GameDto } from './games.dto';  // Si es necesario
import { GameGraphQL } from 'src/graphql/game.graphql';  // Clase GraphQL

@Resolver(() => GameGraphQL)  // Usa GameGraphQL en lugar de Game
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  // Query para obtener todos los juegos
  @Query(() => [GameGraphQL])  // Asegúrate de que el tipo de retorno sea GameGraphQL
  async findAllGames(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Number, defaultValue: 10 }) limit: number,
  ) {
    const { games } = await this.gamesService.findAll(page, limit);
    return games;
  }

  // Query para obtener un juego específico por ID
  @Query(() => GameGraphQL)  // De nuevo, usa GameGraphQL
  async findOneGame(@Args('id', { type: () => String }) id: string) {
    return this.gamesService.findOne(id);
  }

  // Mutation para crear un nuevo juego
  @Mutation(() => GameGraphQL)  // Usamos GameGraphQL como tipo de retorno
  async createGame(@Args('createGameDto') createGameDto: GameDto) {
    return this.gamesService.create(createGameDto);
  }
}
