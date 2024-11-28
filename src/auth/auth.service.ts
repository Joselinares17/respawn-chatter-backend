import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';

// Configura el cliente JWKS para obtener la clave pública de Auth0
const client = jwksClient({
  jwksUri: 'https://dev-cwnz3kxvoe0bpwc4.us.auth0.com/.well-known/jwks.json', // Reemplaza con tu dominio de Auth0
});

// Función que obtiene la clave pública desde Auth0
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

@Injectable()
export class AuthService {
  // Aquí va tu lógica de verificación de JWT
  async validateToken(token: string): Promise<any> {
    try {
      // Verifica el token usando la clave pública obtenida
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
          if (err) {
            return reject(new UnauthorizedException('Invalid token'));
          }
          resolve(decoded);
        });
      });

      return decoded; // Devuelve los datos decodificados del token

    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
