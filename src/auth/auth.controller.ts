import { Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/reviews_and_ratings/users/user.service'; // Asegúrate de importar el servicio de usuarios
import { CreateUserDto } from 'src/reviews_and_ratings/users/dto/create-user.dto'; // Importa el DTO de creación de usuario
import { CacheService } from 'src/cache/cache.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly authService: AuthService,
    private readonly userService: UserService, // Inyecta el servicio de usuario
  ) {}

  @Get('profile')
  async getProfile(@Req() req) {
    // Aquí se obtiene el token desde la cabecera Authorization

    const token = req.headers.authorization.split(' ')[1]; // Asumiendo que es Bearer <token>

    console.log('Este es el token: ', token);

    try {
      const decodedToken = await this.authService.validateToken(token);

      console.log('Decoded Token:', decodedToken);

      // Aquí puedes usar los datos decodificados, por ejemplo, el `sub` o `email`
      const userPayload = decodedToken;  // El payload que has decodificado

      console.log(userPayload.email);
      console.log(userPayload.nickname);

      const cacheKey = `user:${userPayload.email}`;

       // Intentamos obtener los datos del caché
       const cachedUser = await this.cacheService.getCache(cacheKey);

       if (cachedUser) {
         // Si el usuario está en el caché, lo devolvemos directamente
         console.log('Usuario desde caché:', cachedUser);
         return { source: 'cache', user: cachedUser };
       }
      
      // Crear el DTO para el usuario
      const createUserDto: CreateUserDto = {
        email: userPayload.email,  // Asumiendo que 'email' está en el payload
        username: userPayload.nickname,  // O el campo que uses para el nombre de usuario
        createdAt: new Date(),  // Puedes ajustar la fecha de creación si es necesario
      };

      // Usar la función findOrCreateUser para crear o actualizar el usuario
      const user = await this.userService.findOrCreateUser(createUserDto);

      // Guardar los datos en caché para futuras solicitudes
      await this.cacheService.setCache(cacheKey, user, 3600); // 1 hora de TTL

      console.log('Guardando en caché con clave:', cacheKey);
      console.log('Valor de la caché:', JSON.stringify(user));
      await this.cacheService.setCache(cacheKey, user, 3600); // 1 hora de TTL


      // Devuelve los datos del usuario
      return { message: 'User validated and found', user };
    } catch (error) {
      return { error: 'Invalid token', message: error.message };
    }
  }
}
