import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class CacheService {
  private client: Redis.Redis;

  constructor() {
    // Configuración de Redis utilizando ioredis
    this.client = new Redis.Redis({
      host: 'localhost', // Dirección de tu servidor Redis
      port: 6379,        // Puerto de Redis
    });
  }

  // Guardar en caché
  async setCache(key: string, value: any, ttl: number): Promise<void> {
    // Utiliza el cliente Redis para guardar datos con un TTL
    await this.client.set(key, JSON.stringify(value), 'EX', ttl); // TTL en segundos
  }

  // Obtener del caché
  async getCache<T>(key: string): Promise<T | null> {
    // Obtener el valor del caché
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  // Eliminar del caché
  async deleteCache(key: string): Promise<void> {
    // Eliminar el valor del caché
    await this.client.del(key);
  }

  // Cerrar la conexión con Redis
  async closeConnection() {
    await this.client.quit();
  }
}
