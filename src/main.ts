import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLFactory } from '@nestjs/graphql';
import { ExpressAdapter } from '@nestjs/platform-express';
import { scheduleSyncGames } from './reviews_and_ratings/games/cron/syncGames';

import * as dotenv from 'dotenv';
import * as express from 'express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  scheduleSyncGames();

  // Habilitar CORS
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
