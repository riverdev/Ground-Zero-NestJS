import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFiledbController as UserFiledbController } from '../userfiledb.controller';
import { UserFiledbService } from '../userfiledb.service';

describe('UserFiledbController', () => {
  let controller: UserFiledbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFiledbController],
      providers: [UserFiledbService, ConfigService],
    }).compile();

    controller = module.get<UserFiledbController>(UserFiledbController);
  });

  it('should be defined', () => {
    expect(controller.addUser).toBeDefined();
  });
});
