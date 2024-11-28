import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class JwtAuthGuard {
  private jwksClient: jwksClient.JwksClient;

  constructor() {
    // Configura el cliente de JWK de Auth0
    this.jwksClient = jwksClient({
      jwksUri: 'https://dev-cwnz3kxvoe0bpwc4.us.auth0.com/.well-known/jwks.json',
    });
  }

  // Función para obtener la clave pública y verificar el token
  async verifyToken(token: string) {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded) {
      throw new UnauthorizedException('Token no válido');
    }

    const { kid } = decoded.header;  // 'kid' es el identificador de la clave en el JWK

    // Obtener la clave pública del JWK
    const key = await this.getSigningKey(kid);
    if (!key) {
      throw new UnauthorizedException('No se pudo obtener la clave pública');
    }

    // Verificar el token con la clave pública
    try {
      const verified = jwt.verify(token, key.publicKey, { algorithms: ['RS256'] });
      return verified;
    } catch (err) {
      throw new UnauthorizedException('Token no válido');
    }
  }

  // Obtener la clave pública desde el JWK
  private getSigningKey(kid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.jwksClient.getSigningKey(kid, (err, key) => {
        if (err) {
          reject(err);
        }
        resolve(key);
      });
    });
  }
}
