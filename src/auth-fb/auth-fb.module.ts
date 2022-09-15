import { Module } from '@nestjs/common';
import { AuthFbService } from './auth-fb.service';
import { AuthFbController } from './auth-fb.controller';

@Module({
  controllers: [AuthFbController],
  providers: [AuthFbService],
})
export class AuthFbModule {}
