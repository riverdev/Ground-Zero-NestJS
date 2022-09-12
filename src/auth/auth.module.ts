// this file is auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
//import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../modules/users/users.module';
import { AuthService } from './auth.service';
//import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserFiledbService } from '../modules/user-filedb/userfiledb.service';
import { AuthController } from './auth.controller';
import {
  JwtAccessTokenStrategy,
  JwtRereshTokenStrategy /*LocalStrategy, JwtStrategy*/,
} from './strategies';

@Module({
  imports: [
    UsersModule,
    //UserLoginModule,
    //PassportModule,
    JwtModule.register({}), //Intentionally left empty because we have 2 tokens to generate and we dedicate a method for that in AuthService
  ],

  providers: [
    AuthService,
    UserFiledbService,
    //  JwtStrategy,
    //  LocalStrategy,
    JwtRereshTokenStrategy,
    JwtAccessTokenStrategy,
  ],

  exports: [AuthService],

  controllers: [AuthController],
  //exports: [/*AuthService,*/ JwtModule, PassportModule],
})
export class AuthModule {}
