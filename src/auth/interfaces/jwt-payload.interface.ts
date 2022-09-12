export interface JwtPayloadInterface {
  // The user id is an alternative to using the email as an identification source
  //  but it adds an overhead of coding to implement because the id is created during
  //   the user is creation so then the token needs to be created after the user and then
  //   the user object needs to be updated with the token value.
  //id: string,
  sub: number; //This is standrad use of sub to id the user but it is of type number
  // and our user has an id of type string. So I put the 'sub' here but dont use it.
  roles: string[];
  email: string;
}
