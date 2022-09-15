import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthFbService {
  constructor() {
    //Need fb service here to inject
  }

  public login(email: string, password: string) {
    // Fb logic here
  }

  public register() {
    //
  }
}
