// this file is auth.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { jsonPrettify } from '../common/helpers/global.helper';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto';
import { JwtAccessGuard, JwtRefreshGuard } from './guards';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   *
   * @param signupDto
   */
  @Post('/jwt/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() signupDto: SignupDto): Promise<Tokens> {
    return this.authService.signupLocal(signupDto);
  }

  /**
   *
   * @param loginDto
   */
  @Post('/jwt/login')
  @HttpCode(HttpStatus.OK)
  loginLocal(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this.authService.loginLocal(loginDto);
  }

  /**
   *
   * @param userIdToLogout
   * @returns Promise<any>
   */
  //If the AuthGuard fails it will not allow to continue to this route.
  //If it doesnt fail then it will hold the value of the payloacd in req.user property.
  @UseGuards(JwtAccessGuard)
  @Post('/jwt/logout')
  @HttpCode(HttpStatus.OK)
  async logoutLocal(@Request() req) {
    const accessTokenPayload = req.user;
    const userEmail = accessTokenPayload.email;

    console.log(
      `[auth.controller logout route] req.user = ${jsonPrettify(req.user)} `,
    );

    return this.authService.logoutLocal(userEmail);
  } //end logoutLocal

  //If the AuthGuard fails it will not allow to continue to this route.
  //If it doesnt fail then it will return the value of the payload in req.user property.
  @UseGuards(JwtRefreshGuard)
  @Post('/jwt/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshLocal(@Request() req): Promise<string> {
    const accessTokenPayload = req.user;
    const userEmail = accessTokenPayload.email;
    const userRefreshToken = req.user['refreshToken'];

    // console.log(
    //   `[auth.controller logout route] req.user = ${jsonPrettify(
    //     req.user,   )} `,
    // );

    // console.log(
    //   `[auth.controller logout route] req.user userRefreshToken = ${userRefreshToken}`,
    // );

    // console.log(
    //   `[auth.controller logout route] req.user userEmail = ${userEmail}`,
    // );

    //todo: Need to return the refresh tokens
    return this.authService.refreshLocal(userEmail, userRefreshToken);
  } //end refreshLocal

  @UseGuards(JwtAccessGuard)
  @Get('jwt/profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req): Promise<string> {
    // console.log(
    //   `[auth.controller logout route] req.user = ${jsonPrettify(
    //     req.user,   )} `,
    // );
    return jsonPrettify(req.user);
  } //end getProfile
} //end AuthController
