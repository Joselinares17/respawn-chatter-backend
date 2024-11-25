import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReviewsModule } from 'src/reviews_and_ratings/reviews/reviews.module';
import { ForumModule } from './forum/forum.module';
import { GamesModule } from './reviews_and_ratings/games/games.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './Datos.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_FORUM');
        console.log('MONGODB_FORUM:', uri); // Esto debería imprimir tu URI de MongoDB
        if (!uri) {
          throw new Error('La variable de entorno MONGODB_FORUM no está configurada.');
        }
        return { uri };
      },
      inject: [ConfigService],
      connectionName: 'forum',
    }),
    MongooseModule.forRoot('mongodb+srv://admin:admin@clusterarquitecturasoft.4hnsp.mongodb.net/gameReviewsDB?retryWrites=true&w=majority&appName=ClusterArquitecturaSoftware'),
    ReviewsModule, // Asegúrate de importar el módulo de reseñas aquí
    GamesModule,
    ForumModule
  ],
})
export class AppModule {}
