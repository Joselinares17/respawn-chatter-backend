import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint para encontrar o crear un usuario
  @Post('find-or-create')
  async findOrCreateUser(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userService.findOrCreateUser(createUserDto);
  }

  // Endpoint para buscar un usuario por su correo electrónico
  @Get(':email') // Endpoint para obtener usuario por email
  async findByEmail(@Param('email') email: string): Promise<UserDocument | null> {
    console.log("Email recibido:", email);
    return this.userService.findByEmail(email); // Asegúrate de usar el método correcto del servicio
  }
  
}
