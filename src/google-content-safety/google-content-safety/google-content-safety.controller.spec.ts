import { Test, TestingModule } from '@nestjs/testing';
import { GoogleContentSafetyController } from './google-content-safety.controller';

describe('GoogleContentSafetyController', () => {
  let controller: GoogleContentSafetyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleContentSafetyController],
    }).compile();

    controller = module.get<GoogleContentSafetyController>(GoogleContentSafetyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
