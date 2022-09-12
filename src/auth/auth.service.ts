// this file is auth.service.ts

import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FilterUserFiledbDto } from '../modules/user-filedb/dtos/filter-userfiledb.dto';
import { UserFiledb } from '../modules/user-filedb/entities/userFiledb.object';
import { UserFiledbService } from '../modules/user-filedb/userfiledb.service';
import { SignupDto } from './dto/signup.dto';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { CreateUserFiledbDto } from '../modules/user-filedb/dtos/create-userfildb.dto';
import { LoginDto } from './dto';
import {
  ACCESS_TOKEN_DURATION,
  DEFAULT_PAYLOAD_FOR_TOKENS,
  REFRESH_TOKEN_DURATION,
} from './constants/jwt.constants';
//import { jsonPrettify } from '../common/helpers/global.helper';

@Injectable()
export class AuthService {
  //Injecting dependencies
  constructor(
    // private userSvc: UsersService,
    private userFiledbSvc: UserFiledbService,
    //private UserFiledbService: UserFiledbService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private filedbService: UserFiledbService,
  ) {
    this.filedbService.dbfilePath =
      this.configService.get('DB_LOCAL_FILE_PATH');
    this.filedbService.dbfileName = this.configService.get('DB_LOCAL_FILENAME');
  }

  private readonly logger = new Logger(AuthService.name);

  /**
   *
   * @param signupData
   */
  async signupLocal(signupData: SignupDto): Promise<Tokens> {
    this.logger.debug(`>> Flow: >> Starting >> [auth.service_signupLocal] `);

    //* ### STEP-1:  Initialize the new users default values
    //* #######################################################
    // Initialize the new user's roles
    //todo: When adding RBAC then give a global solution to the roles mechanizem
    const defaultRoles: string[] = ['role1', 'role2'];

    //* ### STEP-2:  Generate the tokens
    //* #######################################################
    //Step-2A: Setup the value of the claims (jwt payload)
    const updatePayloadForTokens: JwtPayloadInterface =
      DEFAULT_PAYLOAD_FOR_TOKENS;
    updatePayloadForTokens.email = signupData.emailAddress;

    //Step-2B: Generate the two tokens
    const generatedTokens: Tokens = await this.getTokens(
      updatePayloadForTokens,
    );

    //* ### STEP-3: Create the user in the db
    //* #######################################################
    // Step-3A: Prepare the user object data

    //Hash the refresh token
    const refreshTokenHashed = await this.hashSaltText(
      generatedTokens.refreshToken,
    );

    //Hash the human-readable input password
    const hashedPassword = await this.hashSaltText(
      signupData.plainTextSignupPassword,
    );

    //Insert the values into the dataForNewUser instance
    const dataForNewUser = {} as CreateUserFiledbDto;
    dataForNewUser.loginName = signupData.userName;
    dataForNewUser.passwordHash = hashedPassword;
    dataForNewUser.roles = defaultRoles;
    dataForNewUser.emailAddress = signupData.emailAddress;
    dataForNewUser.hashRefreshToken = refreshTokenHashed;

    //Step-3B: Create the new user in the db
    const newUser: UserFiledb = await this.filedbService.addUserFiledb(
      dataForNewUser,
    );
    if (newUser === undefined) {
      throw new InternalServerErrorException(
        `[auth.service_signupLocal] Something went wrong, could not add the new user.`,
      );
    }

    return generatedTokens;
  } // signupLocal

  /**
   *
   * @param loginData
   * @returns
   */
  async loginLocal(loginData: LoginDto): Promise<Tokens> {
    //Step-1: Find the user using email
    //todo: @unit-test needed here
    const searchFilter = {} as FilterUserFiledbDto;
    searchFilter.emailAddress = loginData.emailAddress;

    const foundUserList: UserFiledb[] =
      await this.userFiledbSvc.getfilteredUserFiledb(searchFilter);

    if (foundUserList === undefined) {
      throw new ForbiddenException(`Access denied`);
    }

    const userFound = foundUserList[0];

    //Step-2: Verify that password is correct
    //todo: @unit-test needed here
    const matchedPassword: boolean = await bcrypt.compare(
      loginData.plainTextLoginPassword,
      userFound.passwordHash,
    );
    if (!matchedPassword) {
      throw new ForbiddenException(`Access denied`);
    }

    //Step-3: Generate the two tokens
    //todo: @unit-test needed here

    // Setup the value of the claims (jwt payload)
    const updatePayloadForTokens: JwtPayloadInterface =
      DEFAULT_PAYLOAD_FOR_TOKENS;
    updatePayloadForTokens.email = userFound.emailAddress;

    const generatedTokens: Tokens = await this.getTokens(
      updatePayloadForTokens,
    );

    //Step-4: Update the user db object with the new refresh token
    //todo: @unit-test needed here

    const hashedRT: string = await this.hashSaltText(
      generatedTokens.refreshToken,
    );

    userFound.hashRefreshToken = hashedRT;

    if (!this.overwriteUserInDb(userFound)) {
      throw new InternalServerErrorException(
        `Something went wrong, could not update the user's refresh token.`,
      );
    }

    return generatedTokens;
  } //end loginLocal

  /**
   *
   * @param userId
   */
  async logoutLocal(userEmail: string): Promise<any> {
    //Step-1 find the user by the userEmail
    const searchFilter = {} as FilterUserFiledbDto;
    searchFilter.emailAddress = userEmail;

    const foundUserList: UserFiledb[] =
      await this.userFiledbSvc.getfilteredUserFiledb(searchFilter);

    if (foundUserList === undefined) {
      throw new NotFoundException(
        `Could not find user with email "${userEmail}"`,
      );
    }

    //Step-2 Reset user db refresh token to an empty value
    //todo: @unit-test needed here

    const userFound = foundUserList[0];
    userFound.hashRefreshToken = '';

    if (!this.overwriteUserInDb(userFound)) {
      throw new InternalServerErrorException(
        `Something went wrong, could not update user's refreshToken value to an empty-string in db.`,
      );
    }
  } //end logoutLocal

  /**
   *
   * @param userId
   */
  async refreshLocal(
    userEmail: string,
    plainTextInputRt: string,
  ): Promise<string> {
    //Step-1 find the user by the userEmail
    const searchFilter = {} as FilterUserFiledbDto;
    searchFilter.emailAddress = userEmail;

    const foundUserList: UserFiledb[] =
      await this.userFiledbSvc.getfilteredUserFiledb(searchFilter);

    if (foundUserList === undefined) {
      throw new ForbiddenException('Access denied');
    }

    const userFound = foundUserList[0];

    //Step-2 Validate that the input RT is same as db RT value
    //todo: @unit-test needed here

    // Case there is no refresh token exists in user's db (caused by logout)
    if (!userFound.hashRefreshToken) {
      throw new ForbiddenException('Access denied, missing refresh token');
    }

    // Case the user's db RT value doesnt match the input RT
    const rtMatches = await bcrypt.compare(
      plainTextInputRt,
      userFound.hashRefreshToken,
    );
    if (!rtMatches) {
      throw new ForbiddenException('Access denied, mismatched refresh token');
    }

    //Step-3 Generate a ne access token and return it
    //todo: @unit-test needed here
    const updatePayloadForTokens: JwtPayloadInterface =
      DEFAULT_PAYLOAD_FOR_TOKENS;
    updatePayloadForTokens.email = userFound.emailAddress;
    const newAccessToken = await this.generateAccessToken(
      updatePayloadForTokens,
    );

    return newAccessToken;
  } //end refreshLocal

  //*####################################################
  //*###     U T I L I TY    H E L P ER    F U N C    ###
  //*####################################################

  /**
   *  The 'getTokens()' function uses the payloadForToken (claims) input
   *  together with a secret & expire duration to generate two tokens
   *  The tokens are AT & RT (access & refresh tokens).
   *  This function is called by either the signup or login processes.
   *  In both signup & login we want to generate new AT & RT.
   */
  async getTokens(payloadForToken: JwtPayloadInterface) {
    const [accToken, refToken] = await Promise.all([
      this.jwtService.signAsync(payloadForToken, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: ACCESS_TOKEN_DURATION,
      }),

      this.jwtService.signAsync(payloadForToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: REFRESH_TOKEN_DURATION,
      }),
    ]);

    return {
      accessToken: accToken,
      refreshToken: refToken,
    };
  } //getTokens()

  /**
   * This method focuses on creating only the Access Token (AT).
   * It is needed when we want to re-generate an AT that has expired.
   * The call to this method will only be available if the refresh-token (RT) is applicable.
   * An RT is applicable if it is not expired yet.
   *
   * @param payloadForAccessToken
   * @returns
   */
  async generateAccessToken(payloadForAccessToken: JwtPayloadInterface) {
    const accessToken = await this.jwtService.signAsync(payloadForAccessToken, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: ACCESS_TOKEN_DURATION,
    });

    return accessToken;
  } //generateAccessToken()

  /**
   * This 'overwriteUserInDb()' method receives a user item with a value in the 'id'
   * property, then it overwrites the existing user with that id with the input user item.
   *
   * IMPORTANT:
   * (1) Must have a value in the id property, otherwise returns null.
   * (2) The old user object will be deleted and the new will replace it
   *     must take care to include properties & values of the old in the new if
   *     you want to preserve them.
   * (3) The function stores the value in the users db object.
   *
   * Return Options:
   * (1) Success returns 'true'
   * (2) Not found a user with input id returns 'false'
   * (3) Otherwise returns 'undefined' meaning something went wrong
   * @param userToUpdate <UserFiledb>
   *
   */

  async overwriteUserInDb(userToUpdate: UserFiledb): Promise<boolean> {
    const updateResult: UserFiledb =
      await this.filedbService.updateUserFiledbObject(userToUpdate);
    if (updateResult === undefined) {
      throw new InternalServerErrorException(
        `Something went wrong, got result 'undefined', could not update the user.`,
      );
    }

    if (updateResult === null) {
      this.logger.warn(
        `>> WARNINIG >> [auth.service_overwriteUserInDb] Could not find user to update with given 'id' = '${userToUpdate.id}'.`,
      );

      return false;
    }

    return true;
  } //end overwriteUserInDb()

  /**
   *
   * @param plainText
   * @returns
   */
  async hashSaltText(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, 10); //salt is 10
  }

  //*####################################################
  //*###    L E G A C Y   F U N C T I O N S           ###
  //*####################################################

  /**
   *
   * @param username
   * @param pass
   * @returns
   */
  async validateUser(username: string, pass: string): Promise<any> {
    console.log(
      `[auth.service_validateUser] Input ::: username = ${username} , password=${pass}`,
    );

    // This expression uses the users-filedb (filesystem based db) module
    const myObject = {} as FilterUserFiledbDto;
    myObject.loginName = username;
    const user0: UserFiledb[] = await this.userFiledbSvc.getfilteredUserFiledb(
      myObject,
    );

    if (user0 === undefined) {
      //console.log(`[controller GET] filterDto:\n ${jsonPrettify(filterDto)}`);
      // this.logger.error(
      //   `>> ERROR >> [controller GET] filterDto:\n ${jsonPrettify(filterDto)}`,
      // );

      throw new NotFoundException(
        `Could not find any user by the given search filter.`,
      );
    }

    console.log(`Value of user0[0].loginName =  ${user0[0].loginName}`);

    // This expression uses the users (hardcoded memory-db) module
    //const user = await this.userSvc.findOne(username);

    if (user0 && user0[0].passwordHash == pass) {
      // The version to work with the users hard-coded is
      //if (user && user.password == pass) {

      // The version to work with the users hard-coded is
      //const { password, ...result } = user;

      const { passwordHash, ...result } = user0[0];

      // The above expression means:
      // Seperate the user properties into two parts.
      //  (1) The first is the 'password' (we do nothing with it).
      //  (2) The second (all properties exceptthe password) is 'result'
      // This way the password is not returned from this function.

      return result;
    }

    return null;
  } //end validateUser

  /**
   *
   * @param user
   * @returns
   */
  async login(user: UserFiledb): Promise<any> {
    // Note: we choose a property name of sub to hold our userId value to be consistent with JWT standards.

    console.log(
      `[auth.service_login] user.name = ${
        user.loginName
      }  ::: user.sub = ${1}  `,
    );
    const payload: JwtPayloadInterface = {
      sub: 1,
      roles: ['place-holder-role'],
      email: 'place-holder@email.com',
    };

    const token = await this.jwtService.sign(payload);

    return { token: token };
  } //end login()
} //end class AuthService
