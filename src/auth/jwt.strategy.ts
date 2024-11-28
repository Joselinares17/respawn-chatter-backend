import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';  // Asegúrate de importar jsonwebtoken
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/reviews_and_ratings/users/user.service';

interface JwtPayload {
  email: string;
  nickname?: string;
  name?: string;
  updated_at: Date;
  iss: string;  // El emisor del token
  aud: string;  // La audiencia del token
  exp: number;  // La fecha de expiración
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private jwksUri = 'https://dev-cwnz3kxvoe0bpwc4.us.auth0.com/.well-known/jwks.json'; // URL de JWKS de Auth0

  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (jwtPayload: JwtPayload) => {
        try {
          const token = ExtractJwt.fromAuthHeaderAsBearerToken()(jwtPayload);
          if (!token) {
            console.log("Token no encontrado");
            throw new UnauthorizedException('Token no encontrado');
          }

          const decoded = jwt.decode(token, { complete: true });
          if (!decoded || !decoded.header) {
            console.log("Header no encontrado en el token");
            throw new UnauthorizedException('Header no encontrado en el token');
          }

          const { kid } = decoded.header;
          console.log("Kid extraído:", kid);
          if (!kid) {
            throw new UnauthorizedException('No se encuentra el Kid en el token');
          }

          const client = jwksClient({ jwksUri: this.jwksUri });
          const key = await client.getSigningKey(kid);
          const publicKey = key.getPublicKey();

          console.log("Clave pública obtenida:", publicKey);
          return publicKey;
        } catch (error) {
          console.error("Error en secretOrKeyProvider:", error);
          throw new UnauthorizedException('Invalid token');
        }
      },
    });
  }

  async validate(payload: JwtPayload) {
    console.log("Función validate llamada, payload:", payload);
    
    const userData = {
      email: payload.email,
      username: payload.nickname || payload.name,
      createdAt: payload.updated_at,
    };

    // Llama al servicio para registrar o actualizar al usuario
    const user = await this.userService.findOrCreateUser(userData);

    // Retorna el usuario registrado o actualizado
    return user;
  }
}
