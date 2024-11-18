import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsModule } from 'reviews/reviews.module';
import { ForumModule } from './forum/forum.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/gameReviewsDB'),
    ReviewsModule, // Asegúrate de importar el módulo de reseñas aquí
    ForumModule
  ],
})
export class AppModule {}
