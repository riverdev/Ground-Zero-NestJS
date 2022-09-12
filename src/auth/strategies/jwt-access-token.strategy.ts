import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
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

  async validate(payload: any) {
    // What the 'validate' function is designed to do is whatever it returns
    // will assign the value of the 'return' (in this case 'payload')
    // into req.user
    return payload;

    //return { userId: payload.sub, username: payload.username };
  }
}
