//*  This file is left here for reference or future use
//* It is a template for a strategy the uses the password-local
//* functionality (uses only name + password to verify )
//* to use it must first install the following two packages:
//*
//*    npm install passport-local
//*    npm install -D @types/passport-local
//*

// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super();
//   }

//   async validate(username: string, password: string): Promise<any> {
//     const user = await this.authService.validateUser(username, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }

//     return user;
//   }
// }
