import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { ResponseSchema } from './response.schema';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Response', schema: ResponseSchema }],
      'gameReviews'
    ),
  ],
  controllers: [ResponsesController],
  providers: [ResponsesService, CacheService],
  exports: [ResponsesService],
})
export class ResponsesModule {}
