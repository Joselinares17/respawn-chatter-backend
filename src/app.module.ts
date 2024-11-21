import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsModule } from 'src/reviews_and_ratings/reviews/reviews.module';
import { ForumModule } from './forum/forum.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:admin@clusterarquitecturasoft.4hnsp.mongodb.net/gameReviewsDB?retryWrites=true&w=majority&appName=ClusterArquitecturaSoftware'),
    ReviewsModule, // Asegúrate de importar el módulo de reseñas aquí
    ForumModule
  ],
})
export class AppModule {}
