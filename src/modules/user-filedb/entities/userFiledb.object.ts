//* user.object.ts

export class UserFiledb {
  id: string; //Mandatory+PI

  loginName: string; //Mandatory

  passwordHash: string; //Mandatory

  roles: string[]; //Mandatory

  emailAddress: string; //Mandatory

  passwordSalt: string; //Mandatory

  hashAlgorithm: string; //Mandatory

  confirmationToken: string; //Optional

  hashRefreshToken: string; //Mandatory can be '' empty string when there is no refresh token.

  tokenGenerationTime: string; // Mandatory + should be datetime / timestamp

  tokenExpirationTime: string; // Mandatory + should be datetime / timestamp

  emailValidationStatus: string; // Mandatory +  Should be ENUM
}

//orderCount: number;     //done Deprecated - delete this no use for it
