import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserFiledbDto } from './dtos/create-userfildb.dto';
import { UpdateUserFiledbDto } from './dtos/update-userfiledb.dto';
import { UserFiledb } from './entities/userFiledb.object';
import { UserFiledbService } from './userfiledb.service';
import { FilterUserFiledbDto } from './dtos/filter-userfiledb.dto';
import { jsonPrettify } from '../../common/helpers/global.helper';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserFiledbController {
  constructor(
    private readonly configService: ConfigService,
    private filedbService: UserFiledbService,
  ) {
    //DB_LOCAL_FILE_PATH = './'
    this.filedbService.dbfilePath =
      this.configService.get('DB_LOCAL_FILE_PATH');

    //SB_LOCAL_FILENAME='user.filedb.json'
    this.filedbService.dbfileName = this.configService.get('DB_LOCAL_FILENAME');
  }

  private readonly logger = new Logger(UserFiledbController.name);

  /**
   * Finds users either by filter or if no filter then get all users
   */
  @Get()
  async getUsersByFilter(
    @Query() filterDto: FilterUserFiledbDto,
  ): Promise<UserFiledb[]> {
    // Url is: http://localhost:8080/user?loginName=Brad&&id=78787jj&&emailAddress=mymail@geweez.com
    // The properties that can be used as filters are only: loginName, passwordHash, emailAddress & id
    //console.log(' >>  Starting  >> ROUTE Get [userfiledb.controller-getUsersByFilter] ');
    this.logger.debug(
      `>> Flow: >> Starting >> ROUTE Get [userfiledb.controller-getUsersByFilter] `,
    );

    //console.log(`[getUsersByFilter]   filterDto: ${jsonPrettify(filterDto)}`);

    //Case no values given in filterDto - since they are all optional it can happen
    if (Object.keys(filterDto).length === 0) {
      //console.log(`There is no data to filter, so returning all users ...\n`);
      this.logger.debug(
        `>> FYI >> There is no data to filter, so returning all users ...\n `,
      );
      return this.filedbService.getAllUserFiledb();
    }

    const filteredUsers: UserFiledb[] =
      await this.filedbService.getfilteredUserFiledb(filterDto);

    // If nothing found then the method 'filedbService.getfilteredUserFiledb' returns undefined
    if (filteredUsers === undefined) {
      throw new NotFoundException(
        `Could not find any user by the given search filter.`,
      );
    }

    return filteredUsers;
  } //end getUsersByFilter /// PASSED DEV TEST

  /**
   * The url to call this route is - POST http://localhost:8080/user/add with a body
   *    { "loginName": "name", "passwordHash": "Aa*", "emailAddress": "aa@bb.cc"}
   *         console.log(' >>  Starting  >> ROUTE Post [addUser]');
   * @param credentialsUser <CreateUserFiledbDto>
   * @returns Promise<UserFiledb>
   */
  @Post('add')
  async addUser(
    @Body() credentialsUser: CreateUserFiledbDto,
  ): Promise<UserFiledb> {
    this.logger.debug(
      `>> Flow: >> Starting >> ROUTE Post [userfiledb.controller-addUser].`,
    );

    if (credentialsUser.loginName === undefined) {
      credentialsUser.loginName = 'NoName';
    }

    const newUser: CreateUserFiledbDto = {
      //id: '',
      //orderCount: 0,
      loginName: credentialsUser.loginName,
      passwordHash: credentialsUser.passwordHash,
      roles: ['place-holder-role'],
      emailAddress: credentialsUser.emailAddress,
      hashRefreshToken: 'place-holder-refresh-token',
    };

    const result: UserFiledb = await this.filedbService.addUserFiledb(newUser);

    if (result === undefined) {
      //console.warn(`[controller Post('add')] newUser:\n ${jsonPrettify(newUser)}`);
      // this.logger.error(
      //   `>> ERROR >> ROUTE Post [userfiledb.controller-addUser] newUser:\n ${jsonPrettify(
      //     newUser,
      //   )}`,
      // );

      throw new InternalServerErrorException(
        `Something went wrong, could not add the new user.`,
      );
    }
    return result;
  } //end addUser   // PASSED DEV TEST

  /**
   *  The url to call this route is - PATCH http://localhost:8080/user with a body
   *    { "id": "78dghwg", "orderCount", 1, "loginName": "my-name", "passwordHash": "Aa*" }
   *    Rules for input object:
   *
   *    (1) The id property is mandatory, all other properties will overwrite existing.
   *    (2) Once the object with matching id is found then the whle input object overwrites the existing.
   *    (3) This means that ommited properties will not exist in the update object (like deleteing them),
   *        but new properties will not be added because they dont exist in the User class.
   * @param userToUpdate <UpdateUserFiledbDto>
   * @returns Promise<UserFiledb>
   */
  @Patch()
  async updateUser(
    @Body() userToUpdate: UpdateUserFiledbDto,
  ): Promise<UserFiledb> {
    //console.log('ROUTE Patch [updateUser] : Starting ');
    this.logger.debug(
      `>> Flow: >> Starting >> ROUTE Patch [userfiledb.controller-updateUser].`,
    );

    const result = await this.filedbService.updateUserFiledbObject(
      userToUpdate,
    );

    if (result === undefined) {
      // this.logger.error(
      //   `>> ERROR >>  ROUTE Patch [userfiledb.controller-updateUser] Somethiing went wrong, got result 'undefined'.`,
      // );
      // console.warn(`[controller Patch() updateUser]: Somethiing went wrong, got result 'undefined'.`);
      throw new InternalServerErrorException(
        `Something went wrong, got result 'undefined' , could not update the user.`,
      );
    }

    if (result === null) {
      // this.logger.error(
      //   `>> ERROR >>  ROUTE Patch [userfiledb.controller-updateUser] Somethiing went wrong, got result 'undefined'.`,
      // );
      //console.warn(`[controller Patch() updateUser]: Somethiing went wrong, got result 'undefined'.`);
      throw new NotFoundException(
        `Could not find user to update with given 'id' = '${userToUpdate.id}'.`,
      );
    }

    return userToUpdate;
  } //end updateUser   // PASSED DEV TEST

  /**
   *   The URL to call will be : DELETE http://localhost:8080/user?id=_my_id_3B7ojLQf
   *   console.log('ROUTE DELETE user by id : Starting ');
   * @param targetUserId <string>
   * @returns Promise<boolean>
   */
  @HttpCode(204)
  @Delete()
  async deleteUserById(@Query('id') targetUserId: string): Promise<void> {
    this.logger.debug(
      `>> Flow: >> Starting >> ROUTE DELETE [userfiledb.controller_deleteUserById].`,
    );

    const result: boolean = await this.filedbService.deleteUserFiledbById(
      targetUserId,
    );

    if (result === undefined) {
      //console.warn(
      //  `[controller Delete() deleteUserById]: Somethiing went wrong, got result 'undefined'.`,
      //);
      // this.logger.error(
      //   `>> ERROR >>  ROUTE Patch [userfiledb.controller-deleteUserById] Somethiing went wrong, got result 'undefined'.`,
      // );

      throw new InternalServerErrorException(
        ` Internal-Error: [userfiledb.controller-deleteUserById] got result === 'undefined', could not delete the user.`,
      );
    }

    if (result === false) {
      // this.logger.error(
      //   `>> ERROR >>  ROUTE Patch [userfiledb.controller-deleteUserById] Somethiing went wrong, got result 'undefined'.`,
      // );

      throw new NotFoundException(
        `Got result 'undefined', couldn't find user to delete with 'id' = '${targetUserId}'.`,
      );
    }

    return;
  } //end deleteUserById     // PASSED DEV TEST

  /**
   *  The URL to call will be : DELETE http://localhost:8080/user/delete-all
   *   console.log('ROUTE DELETE all users : Starting ');
   * @returns Promise<boolean>
   */
  @HttpCode(204)
  @Delete('/delete-all')
  async deleteAllUsers(): Promise<boolean> {
    this.logger.debug(
      `>> Flow: >> Starting >> ROUTE DELETE [userfiledb.controller-deleteAllUsers].`,
    );

    const result = await this.filedbService.deleteAllUsersLogins();

    if (result === undefined || result === false) {
      // console.warn(
      //   `[controller Delete('delete-all'): Somethiing went wrong, got result 'undefined'.`,
      // );
      // this.logger.error(
      //   `>> ERROR >>  ROUTE Patch [userfiledb.controller-deleteAllUsers] Somethiing went wrong, got result 'undefined'.`,
      // );

      throw new InternalServerErrorException(
        `Something went wrong, got result 'undefined' , could not delete the db.`,
      );
    }

    return result;
  } //end deleteAllUsers()     // PASSED DEV TEST
} //end UserFiledbdbController
