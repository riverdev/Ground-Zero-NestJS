// jwt.constants.ts

import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';

const defaultRoles: string[] = ['role1', 'role2'];

export const DEFAULT_PAYLOAD_FOR_TOKENS: JwtPayloadInterface = {
  //id: 'place-holder-id', //Not using the id because the email does the job of unique id of user
  sub: 1, //todo: TBD what value to give if at all, thishas to be a number not a string but I use id as string.
  roles: defaultRoles,
  email: 'place-holder',
};

export const ACCESS_TOKEN_DURATION: number = 60 * 1;
export const REFRESH_TOKEN_DURATION: number = 60 * 2;
// MORE TIME OPTIONS :
//  (1) Minutes:   60 * 3               // seconds times n (minutes) = n minutes
//  (2) Days:      60 * 60 * 24 * 3,    // seconds * minutes * hours * 3 (days) = 3 days
//  (3) Weeks:     60 * 60 * 24 * 7 * 2 // seconds * minutes * hours * days-in-week * 2 (weeks) = 2 weeks
