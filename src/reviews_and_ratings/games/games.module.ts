import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GameSchema } from './game.schema';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }],
    'gameReviews'
  ),
HttpModule,
],
  controllers: [GamesController],
  providers: [GamesService, CacheService],
})
export class GamesModule {}