import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ReviewsModule } from 'src/reviews_and_ratings/reviews/reviews.module';
import { ForumModule } from './forum/forum.module';
import { GamesModule } from './reviews_and_ratings/games/games.module';
import { CustomThrottlerGuard } from './forum/guards/custom-throttler.guard';


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
    ReviewsModule,
    GamesModule,
    ForumModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60 * 1000, // Tiempo de vida en milisegundos
          limit: 10, // Número máximo de solicitudes permitidas por minuto
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
