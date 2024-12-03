import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CustomThrottlerStorageService {
  constructor(@Inject('CACHE_MANAGER') private cache: Cache) {}  // Usa 'CACHE_MANAGER' como el nombre del proveedor de caché

  async getRecord(key: string): Promise<number | null> {
    const value = await this.cache.get(key);
    return value ? Number(value) : null;
  }

  async setRecord(key: string, value: number, ttl: number): Promise<void> {
    await this.cache.set(key, value, ttl);  // Pasa ttl como número directamente
  }
}
