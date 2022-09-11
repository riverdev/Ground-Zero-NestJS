import { Module } from '@nestjs/common';
import { UserFiledbController } from './userfiledb.controller';
import { UserFiledbService } from './userfiledb.service';

@Module({
  controllers: [UserFiledbController],
  providers: [UserFiledbService],
})
export class UserFiledbModule {}
