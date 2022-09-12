import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { jsonPrettify } from '../../common/helpers/global.helper';

@Injectable()
export class JwtRereshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      //Without passReqToCallback: true then the 'req' (request) which holds inside it
      // the bearerToken, will be forgotten (gone).
      // But since we need the 'req' later on in our callback dunction then we want
      // passport to keep it. So we set passReqToCallback: true.
      passReqToCallback: true, //means "we want to get back the refresh-token"
    });
  }

  /**
   *
   * @param req
   *
   * @param payload
   *  The payload is the "business-logic relavent" info inside the token.
   * Passport receives the token from the Bearer token in the Http request.
   * It breaks it up into :
   *  {
   * "sub": 1,
   * "email": "user@test.com",
   * "iat": 1638630436,
   * "exp": 1639235236
   * }
   *  Or whatever we put inside the token when we generate it.
   *
   * @returns
   */

  async validate(req: Request, payload: any) {
    // In this expression we extract the neto value of the token from the 'req' request.
    // Remenber above in the super() we set :   passReqToCallback: true  to keep the value of the request ?
    // Well now we make use of it here, we extract from it the neto value of the token inside te Bearer.
    // For the extraction we replace the text 'Bearer' with an empty string then trim off whitespaces.
    // The value resulting is the neto refresh token & we store it inside 'refreshToken' constant.
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();

    // What the 'validate' function is designed to do is whatever it returns
    // will assign the value of the 'return' (in this case 'payload')
    // into req.user
    const result: any = {
      ...payload,
      refreshToken,
    };
    console.log(
      `================   reult payload is : ${jsonPrettify(result)}`,
    );
    return result;

    //return { userId: payload.sub, username: payload.username };
  }
}
