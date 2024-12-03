import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './users.controller';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }],
    'gameReviews'
  )],
  providers: [UserService, CacheService],
  controllers: [UserController],
  exports: [MongooseModule], // Exporta para que otros módulos puedan usarlo
})
export class UsersModule {}
