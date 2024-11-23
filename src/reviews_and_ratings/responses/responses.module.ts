import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { ResponseSchema } from './response.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Response', schema: ResponseSchema }]),
  ],
  controllers: [ResponsesController],
  providers: [ResponsesService],
  exports: [ResponsesService],
})
export class ResponsesModule {}
