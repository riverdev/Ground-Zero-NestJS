import { Module } from '@nestjs/common';
import { AuthFbService } from './auth-fb.service';
import { AuthFbController } from './auth-fb.controller';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [ConfigModule],
  controllers: [AuthFbController],
  providers: [AuthFbService, FirebaseService],
})
export class AuthFbModule {}
