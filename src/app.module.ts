import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsModule } from 'src/reviews_and_ratings/reviews/reviews.module';
import { ForumModule } from './forum/forum.module';
import { GamesModule } from './reviews_and_ratings/games/games.module';
import { User } from './login/entities/user.entity'; // Ajusta la ruta correctamente

@Module({
  imports: [
    // Carga de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './Datos.env', // Asegúrate de que el archivo .env esté en la raíz de tu proyecto
    }),

    // Configuración de MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_FORUM');
        console.log('Conectando a MongoDB:', uri); // Esto mostrará la URI de MongoDB en la consola
        if (!uri) {
          throw new Error('La variable de entorno MONGODB_FORUM no está configurada.');
        }
        return { uri };
      },
      inject: [ConfigService],
      connectionName: 'forum', // Conexión para MongoDB
    }),
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@clusterarquitecturasoft.4hnsp.mongodb.net/gameReviewsDB?retryWrites=true&w=majority&appName=ClusterArquitecturaSoftware', // Si prefieres usar una URI directa
    ),

    // Configuración de PostgreSQL usando la URL completa
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('POSTGRES_URL'),  // Usamos la URL completa para conectar a PostgreSQL
        entities: [User], // Asegúrate de definir tus entidades correctamente
        synchronize: true, // Sincroniza las tablas automáticamente, cambiar a false en producción
        ssl: {
          rejectUnauthorized: false, // Necesario para bases de datos en la nube como Heroku o Render
        },
        retryAttempts: 5, // Número de intentos de reconexión
        retryDelay: 3000, // Tiempo entre cada intento de reconexión (en milisegundos)
      }),
      inject: [ConfigService],
    }),

    // Módulos adicionales de tu aplicación
    ReviewsModule,
    GamesModule,
    ForumModule,
  ],
})
export class AppModule {}
