import {
  //Request,
  Controller,
  Get,
  Logger,
  //Post,
} from '@nestjs/common';
import { AppService } from './app.service';
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

  //==========================================
  // This is the default route created automatically by NestJS when creating a new project.
  // It is commented here to stay as a refrence to the original source.

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  //==========================================
}
