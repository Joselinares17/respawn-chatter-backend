import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
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
      await user.save();
    }
  
    return user;
  }


  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
 
  
}
