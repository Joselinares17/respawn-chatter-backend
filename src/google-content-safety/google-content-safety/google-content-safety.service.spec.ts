import { Test, TestingModule } from '@nestjs/testing';
import { GoogleContentSafetyService } from './google-content-safety.service';

describe('GoogleContentSafetyService', () => {
  let service: GoogleContentSafetyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleContentSafetyService],
    }).compile();

    service = module.get<GoogleContentSafetyService>(GoogleContentSafetyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
