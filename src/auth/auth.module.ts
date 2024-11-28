import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/reviews_and_ratings/users/user.schema';
import { UserService } from 'src/reviews_and_ratings/users/user.service';
import * as jwksClient from 'jwks-rsa';

// Configuración del cliente JWKS para obtener la clave pública de Auth0
const client = jwksClient({
  jwksUri: 'https://dev-cwnz3kxvoe0bpwc4.us.auth0.com/.well-known/jwks.json', // Cambia esto por tu dominio Auth0
});

// Función para obtener la clave pública de Auth0
async function getKey(header: any): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        reject(err);
      }
      const signingKey = key.getPublicKey(); // Usamos getPublicKey() en lugar de 'publicKey' o 'rsaPublicKey'
      resolve(signingKey);
    });
  });
}

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secretOrKeyProvider: getKey, // Usamos el método de JWKS para obtener la clave pública
        signOptions: { algorithm: 'RS256' }, // Usamos el algoritmo RS256 para JWT
      }),
    }),
    // Configuración de Mongoose para el esquema de usuario
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService], // Asegúrate de tener los servicios necesarios
  exports: [UserService], // Exporta el servicio si es necesario en otros módulos
})
export class AuthModule {}
