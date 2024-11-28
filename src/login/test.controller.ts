import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')  // Define la ruta '/test'
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async testConnection(): Promise<string> {
    return this.testService.testConnection();  // Llama al servicio para probar la conexión
  }
}
