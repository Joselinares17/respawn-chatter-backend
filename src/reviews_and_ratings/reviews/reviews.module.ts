import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewSchema } from './review.schema';
import { GameSchema } from 'src/reviews_and_ratings/games/game.schema';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Review', schema: ReviewSchema },
      { name: 'Game', schema: GameSchema },
    ],
  'gameReviews'),  // Registro del modelo de Mongoose
  ],
  providers: [ReviewsService, CacheService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
