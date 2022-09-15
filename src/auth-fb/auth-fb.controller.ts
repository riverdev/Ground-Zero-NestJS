import { Body, Controller, Post } from '@nestjs/common';
import { UserFiledb } from '../modules/user-filedb/entities/userFiledb.object';
import { AuthFbService } from './auth-fb.service';
import { UserFb } from './data-models/user-fb.model';

@Controller('auth-fb')
export class AuthFbController {
  constructor(private readonly authFbService: AuthFbService) {}

  @Post('login')
  public login(@Body() body: Pick<UserFb, 'email' | 'password'>) {
    return this.authFbService.login(body.email, body.password);
  }

  @Post('register')
  public register() {
    //
  }
}
