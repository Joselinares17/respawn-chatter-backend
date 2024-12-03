import { Controller, Post, Body } from '@nestjs/common';
import { GoogleContentSafetyService } from './google-content-safety.service';

@Controller('content-safety')
export class GoogleContentSafetyController {
  constructor(private readonly googleContentSafetyService: GoogleContentSafetyService) {}

  @Post('moderate')
  async moderate(@Body('text') text: string) {
    return this.googleContentSafetyService.moderateText(text);
  }
}
