import {
  //Request,
  Controller,
  Get,
  Logger,
  Req,
  //Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { jsonPrettify } from './common/helpers/global.helper';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @Get()
  getHello(): string {
    return this.appService.getHomepage();
  }

  @Get('/firebase-auth')
  getTest(@Req() request: Request): string {
    return 'Hello ' + request['user']?.email + '!';
  }

  //==========================================
  // This is the default route created automatically by NestJS when creating a new project.
  // It is commented here to stay as a refrence to the original source.

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  //==========================================
}
