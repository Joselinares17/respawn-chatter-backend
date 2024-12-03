import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User', 'gameReviews') private readonly userModel: Model<UserDocument>,
    private readonly cacheService: CacheService,
  ) {}

  // Método para crear o actualizar un usuario en MongoDB
  async findOrCreateUser(createUserDto: CreateUserDto) {
    // Intentamos encontrar al usuario por su email (campo único)
    let user = await this.userModel.findOne({ email: createUserDto.email });
  
    if (user) {
      // Si el usuario existe, actualizamos sus datos
      user.username = createUserDto.username;
      user.createdAt = new Date(createUserDto.createdAt); // Convertimos la fecha si es necesario
      await user.save();
    } else {
      // Si el usuario no existe, lo creamos (MongoDB asignará automáticamente el _id)
      user = new this.userModel({
        email: createUserDto.email,
        username: createUserDto.username,
        createdAt: new Date(createUserDto.createdAt), // Convertimos la fecha si es necesario
      });
      user = await user.save();
    }
  
    return user;
  }


  async findByEmail(email: string): Promise<UserDocument | null> {
    const cacheKey = `user:${email}`;

     // Intentamos obtener el usuario desde el caché
     const cachedUser = await this.cacheService.getCache(cacheKey);
     const usuario = cachedUser as UserDocument;
     if (usuario) {
       console.log('Usuario encontrado en caché');
       console.log('Este es el usuario encontrado en caché:', usuario);
       return usuario;  // Devolvemos el usuario desde el caché
     }

    const user = this.userModel.findOne({ email }).exec();

    if (user) {
      await this.cacheService.setCache(cacheKey, user, 3600);  // TTL de 1 hora
    }

    return user;
  }
 
  
}
