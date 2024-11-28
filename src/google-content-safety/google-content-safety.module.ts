import { Module } from '@nestjs/common';
import { GoogleContentSafetyService } from './google-content-safety/google-content-safety.service';
import { GoogleContentSafetyController } from './google-content-safety/google-content-safety.controller';

@Module({
  controllers: [GoogleContentSafetyController],
  providers: [GoogleContentSafetyService],
})
export class GoogleContentSafetyModule {}
