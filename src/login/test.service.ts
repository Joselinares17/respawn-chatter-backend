import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; // Asegúrate de la ruta correcta

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,  // Inyecta el repositorio de la entidad User
  ) {}

  async testConnection(): Promise<string> {
    try {
      const count = await this.userRepository.count();  // Realiza una consulta simple
      return `Conexión exitosa! Hay ${count} usuarios en la base de datos.`;
    } catch (error) {
      console.error('Error al conectar con la base de datos:', error);
      return 'Error de conexión con la base de datos';
    }
  }
}
