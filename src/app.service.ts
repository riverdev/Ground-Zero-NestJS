import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(AppService.name, { timestamp: true });

  getHomepage(): string {
    this.logger.verbose('====== Testing verbose log ====');
    this.logger.log('====== Testing log ====');

    const myEnvVarName: string = this.configService.get('MY_ENV_VAR_NAME');

    console.log({ myEnvVarName });

    return `<h1> Ground-Zero-NestJS Open Source Project     </h1>
            <p> Last updated: 2022-09-12-1150 branch [work] </p>
            <br> </br>
            <p align="center">
  <img src="./media/gif-gz-nestjs-logo.gif" width="200" alt="Nest Logo" /> </a>
</p>
            <a href="https://github.com/riverdev/Ground-Zero-NestJS">Link to GitHub repo</a>
            <br> </br>
            <h3> Routes for branch 'unit-base': </h3>
            <ul>
              <li> ------------------------------- </li>
              <li> -- Home  url                 -- </li>
              <li> ------------------------------- </li>
              <li> /              - This home page </li>
              <li> /api           - Displays API with Swagger UI </li>
              <li></li>
              <li> ------------------------------- </li>
              <li> -- Notes url                 -- </li>
              <li> ------------------------------- </li>
              <li> /notes         - The notes homepage </li>
              <li> /notes/list    - A list of notes </li>
              <li> /notes/<value> - POST a note with id <value> , you will get an error explaining what the body format is. </li>
              <li> /notes/<value> - PATCH a note with id <value> , you are free to put anything in the body. </li>
              <li> /notes/<value> - DELETE a note with id <value> , you will get a code 204 response. </li>
              <li> </li>
              <li> </li>
              <li> ------------------------------- </li>
              <li> -- User File DB  url         -- </li>
              <li> ------------------------------- </li>
              <li> {ADD] /user/add - Gets all users (Start with this since there initialy db is empty.) </li>
              <li>                - The object to Post is: </li> 
              <li>                - { "loginName": "myname", "passwordHash": "Aa*", "emailAddress": "aa@bb.cc"} </li>
              <li> </li>
              <li> [LIST]   /user - Gets all users (Db is empty at start of session.) </li>
              <li> </li>
              <li> [SEARCH] /user?loginName=myname&&emailAddress=aa@bb.cc - Filter users by property values. </li>
              <li> </li>
              <li> [EDIT]   /user - Updates a user bu object, The id property is mandatory. </li>
              <li>             - The object to Patch is: </li> 
              <li>             - { "id": "myId", "loginName": "me", "passwordHash": "Cc*", "emailAddress": "a@b.c"} </li>
              <li> </li>
              <li> [REMOVE] /user?id=myID - Delete this specifci user by their id value. </li>
              <li> </li>
              <li> [RESET] /user/delet=all. Deletes all the users in db (resets the DB to 0 users).</li>
              <li> </li>
              <li> FYI : When not interacting with URL for a few minutes the DB rests itself to 0 users.</li>
              </ul>
            `;
  }

  //==========================================
  // This is the default service function created automatically by NestJS when creating a new project.
  // It is commented here to stay as a refrence to the original source.
  //
  // getHello(): string {
  //   return 'Hello World!';
  // }
  //==========================================
}
