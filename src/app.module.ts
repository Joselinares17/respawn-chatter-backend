import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphqlModule } from './graphql/graphql.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ReviewsModule } from 'src/reviews_and_ratings/reviews/reviews.module';
import { ForumModule } from './forum/forum.module';
import { GamesModule } from './reviews_and_ratings/games/games.module';
import { CustomThrottlerGuard } from './forum/guards/custom-throttler.guard';
import { ResponsesModule } from './reviews_and_ratings/responses/responses.module';
import { UsersModule } from './reviews_and_ratings/users/users.module';
import { GoogleContentSafetyModule } from './google-content-safety/google-content-safety.module';
import { AuthModule } from './auth/auth.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './Datos.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        try {
          const uri = configService.get<string>('MONGODB_FORUM');
          if (!uri) {
            throw new Error('FORUM_MONGO no está configurado.');
          }
          return { uri };
        } catch (error) {
          console.error('Error al configurar la conexión a MongoDB:', error.message);
          throw error;
        }
      },
      inject: [ConfigService],
      connectionName: 'forum',
    }),
    MongooseModule.forRoot('mongodb+srv://admin:admin@clusterarquitecturasoft.4hnsp.mongodb.net/gameReviewsDB?retryWrites=true&w=majority&appName=ClusterArquitecturaSoftware',
      {
        connectionName: 'gameReviews',
      },
    ),
    ReviewsModule,
    GamesModule,
    ForumModule,
    ResponsesModule,
    GoogleContentSafetyModule,
    UsersModule,
    AuthModule,
    GraphqlModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60 * 1000, // Tiempo de vida en milisegundos
          limit: 1000, // Número máximo de solicitudes permitidas por minuto
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
