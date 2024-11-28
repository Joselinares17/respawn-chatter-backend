import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';  // Asegúrate de que la ruta sea correcta
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Registra la entidad User para ser utilizada por el repositorio
  controllers: [TestController],  // Registra el controlador
  providers: [TestService],  // Registra el servicio
})
export class LoginModule {}
