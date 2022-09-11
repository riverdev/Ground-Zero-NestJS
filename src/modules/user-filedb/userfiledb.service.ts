import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { nanoid } from 'nanoid'; //On;y use npm install nanoid@3.3.4
import {
  createEmptyFiledb,
  createFile,
  getTextFile,
  jsonPrettify,
} from '../../common/helpers/global.helper';
import { CreateUserFiledbDto } from './dtos/create-userfildb.dto';
import { FilterUserFiledbDto } from './dtos/filter-userfiledb.dto';
import { UserFiledb } from './entities/userFiledb.object';
//import {../helpers/global.helpersdata/create-user.dto';
//import { AppController } from '../../app.controller';

@Injectable()
export class UserFiledbService {
  //................................................
  //*Setting user file-database info

  // The following 2 properties need to be set values in every
  // DI being made when injecting UserFiledbService
  // The code for the injection & setting the values is
  /*
  constructor(
    private filedbService: UserFiledbService,
  ) {
    this.filedbService.dbfilePath = this.configService.get('DB_LOCAL_FILE_PATH');
    this.filedbService.dbfileName = this.configService.get('DB_LOCAL_FILENAME');
  }
   */
  dbfilePath: string;
  dbfileName: string;

  private readonly logger = new Logger(UserFiledbService.name);

  /**
   * * getAllUserFiledb()
   * Reads the user database file this.dbfilename in the this.dbfilePath path.
   * Returns an array of all the user objects.
   * If the file doesnt exist then the method returns undefined.
   *
   * @param {UserFiledb} newUserEntry
   *
   * @return {Promise<UserFiledb[]>}
   */
  async getAllUserFiledb(): Promise<UserFiledb[]> {
    //console.log('====== Starting [getAllUsers] method  ');
    this.logger.debug(
      `>> Flow: >> Starting >> [userfildb.service-getAllUserFiledb] `,
    );

    this.logger.debug(
      `>> FYI >> [userfildb.service-getAllUserFiledb] :::: this.dbfilePath = ${this.dbfilePath} :::: this.dbfileName = ${this.dbfileName}`,
    );

    var result: string;

    try {
      result = await getTextFile(this.dbfilePath, this.dbfileName);
      //console.log(`[getAllUsers] The result is ${this.helper.jsonStringifyPretty(result)}`);
    } catch {
      // console.warn(
      //   `[getAllUsers] Warning - Failed to read the db file using 'getTextFile()'`,
      // );
      this.logger.warn(
        `>> CATCH EVENT >> [userfildb.service-getAllUserFiledb] Failed to read the db file using 'getTextFile()'`,
      );

      return undefined;
    }

    if (result === undefined) return undefined;

    const allUsers: UserFiledb[] = JSON.parse(result);
    //console.log(`[getAllUsers] The JSON result is ${this.helper.jsonStringifyPretty(allUsers)}`);

    return allUsers;
  } //end getAllUserFiledb

  /**
   * * getfilteredUserFiledb(:FilterUserFiledbDto)
   * Filter all the users in the db using a filter object.
   * The filter object is set by the FilterUsersDto and all the properties are optional.
   * So you can filter by no property (will return an empty array) or by one or more.
   * Only users that answer true to all the property values will be selcted to the result array.
   *
   * If nothing found then returns an empty array.
   *
   * An example of the url to input the filter properties and their values :
   *  http://localhost:8080/user?loginName=Decker&&emailAddress=deli@gew.com
   *
   * @param {FilterUserFiledbDto}
   *
   * @return {Promise<UserFiledb[]>}
   */
  async getfilteredUserFiledb(
    filterDto: FilterUserFiledbDto,
  ): Promise<UserFiledb[]> {
    //console.log('====== Starting [getfilteredUsers] method  ');
    this.logger.debug(
      `>> Flow: >> Starting >> [userfildb.service-getfilteredUsers] `,
    );
    //console.log(`[getfilteredUsers]   filterDto:\n ${jsonPrettify(filterDto)}`);

    //Step 1: Get a users list of all the users from the json db file
    const allUsers: UserFiledb[] = await this.getAllUserFiledb();

    if (allUsers === undefined || !allUsers || !allUsers.length) {
      return undefined;
    }

    //Step 2: Filter the users list
    const result: UserFiledb[] = allUsers.filter((itemObj) =>
      Object.keys(filterDto).every((key) => filterDto[key] === itemObj[key]),
    );

    // Case of fail to find users with the input filter
    if (result === undefined || !result || !result.length) {
      this.logger.warn(
        `>> WARNINIG >> [UserFiledbdb.service_getfilteredUserFiledb] No user objects found when applying filter.`,
      );

      return undefined;
    }

    //console.log(`The filtered objects are:\n ${jsonPrettify(result)}`);

    this.logger.verbose(
      `>> FYI >> [UserFiledbdb.service_getfilteredUserFiledb] The filtered objects are result = :\n ${jsonPrettify(
        result,
      )}`,
    );

    return result;
  }

  /**
   * * addUserFiledb(:UserFiledb)
   * * Adds a new user to the this.dbfileName in the this.dbfilePath
   * If the path doesnt exist then ERROR and you need to create one manually.
   * If the file doesnt exist then the app will auto-create it and add the first user.
   *
   * The value of the input object must mandatory have an
   *
   * @param {UserFiledb} newUserEntry
   *
   * @return {Promise<UserFiledb>}
   */
  async addUserFiledb(userToAdd: CreateUserFiledbDto): Promise<UserFiledb> {
    //console.log('====== Starting service [addUser] method ');
    this.logger.debug(
      `>> Flow: >> Starting >> [userfildb.service-addUserFiledb] `,
    );

    //Step 1: Creating an instance of type User named 'newUserEntry'
    // from the input CreatUserDto type
    let newUserEntry = {} as UserFiledb;
    newUserEntry = Object.assign(newUserEntry, userToAdd);
    //console.log(`[ addUser] The new user is \n ${jsonPrettify(newUserEntry)}`);
    this.logger.verbose(
      `>> FYI >> [userfildb.service-addUserFiledb] The new user is \n ${jsonPrettify(
        newUserEntry,
      )}`,
    );

    //Step 2: Get all the users in the db
    const allUsers: UserFiledb[] = await this.getAllUserFiledb();
    if (allUsers === undefined) {
      // console.warn(
      //   '[addUser] Something went wrong, cannot read allUsers from db file.',
      // );
      this.logger.warn(
        `>> WARNINIG >> [userfildb.service-addUserFiledb] Something went wrong, cannot read allUsers from db file.`,
      );

      return undefined;
    }

    //Step 3: Setup the values of the new object into the existing users list
    const newAllUsers = this.prepUserFiledbObject(allUsers, newUserEntry);

    if (newAllUsers === undefined) {
      //If the setupUserObject failed we return type undefined and log the event.
      //console.warn(`[addUser] Warning - Failed setting up 'newAllUsers' `);
      this.logger.warn(
        `>> WARNINIG >> [userfildb.service-addUserFiledb] Failed setting up 'newAllUsers'`,
      );

      return undefined;
    }

    try {
      await createFile(
        this.dbfilePath,
        this.dbfileName,
        jsonPrettify(newAllUsers),
      );
      //createFile(`D:\\Creation\\NestJS\\Playground\\gcrun-pipe\\src\\UserFiledb-filedb\\user-database`,'user-db.json',jsonPrettify(newAllUsers));
    } catch {
      //When the createFile fails we return type undefined and log the event.
      // console.warn(
      //   `[addUser]  Warning - Failed creating file with deleted object}`,
      // );
      this.logger.warn(
        `>> CATCH EVENT >> [userfildb.service-addUserFiledb]  Failed creating file with deleted object`,
      );

      return undefined;
    }
    return newUserEntry; //allUsers;
  } //end addUserFiledb

  /**
   * setupUserFiledbObject( :UserFiledb[], :UserFiledb)
   *
   * What this metyhod does is:
   *  Preparing a new user object to be inserted into the user db and then inserting it into an array.
   *  The writing of the new db array into the db is not done in this method, the caller is responsable for that.
   *  The preperation of a new user object includes these actions:
   *    (1) Assigning a unique value to the id.
   *    (2) Checking if the input array of users is empty, which will set the new user as the first object.
   *    (3) Check if the new user's email exists and abort with 401 error if so.
   *    (4) In all other cases will add the new user to the end of the users array.

   *  The input arguments to this method are:
   *    (1) An array of all the user objects in the db
   *    (2) A user object whom this method will prepare & check before inserting.
   *
   *  The output from this method is either:
   *   (1) Return a new array of user objects with the new user included.
   *   (2) Abort the method with a 401 exception because the new user's email already exists in db.
   *
   * @param {UserFiledb[]} allUsers[]
   * @param {UserFiledb} newUserEntry
   *
   * @return {UserFiledb[]} or 'undefined' which means the email already exists
   */
  prepUserFiledbObject = (
    allUsers: UserFiledb[],
    newUserEntry: UserFiledb,
  ): UserFiledb[] => {
    this.logger.debug(
      `>> Flow: >> Starting >> [userfildb.service-prepUserFiledbObject] `,
    );

    ////Step 2: Use the input id value or create a unique id value for the newly added user

    var newAllUsers: UserFiledb[];

    //Step-1: Setting the unique id for the new user
    //todo  Future feature option: Create a feature that enables this method's caller to determine their own unique id for the new user object.
    //todo  Why do we need the caller to set the unique id ?
    //todo    - Because in case the id is needed before the user is created (like in case of a token that needs to have the user-id in payload)
    //todo    - then it enables the process of creating a new user interact 1 time with the db instead of 2.
    //todo    - This the 2-times process that we want to avoid:
    //todo       - The caller will need first call add-user method , get back the id, create a token with id value as property, then call
    //todo       - the update-user method to add the token to the user object.
    //todo    - But, if the id is only needed after the user is created then this feature is not needed.
    //todo  Here is the logic for this feature:
    //todo:   (1) If the newUserEntry.id is falsey (no value) then create a value with nanoid.
    //todo:       else (case it has a value)
    //todo:       (2) if the value it has already exist in the db (used to id another user)
    //todo:           then create a new nanoid and logger output a warning.
    //todo:   (3) Thats it.
    //todo:        From here on the newUserEntry.id will have a unique id value and it may be the one assigned by the caller for this
    //todo:        method which gives them control on the id value.

    newUserEntry.id = nanoid();

    //* ___Step 2___: Case where the db is empty, new user will be the first and only user in the db.
    if (!Array.isArray(allUsers) || !allUsers.length) {
      // Case of starting with an empty db
      this.logger.debug(
        `>> Event >> [userfildb.service-prepUserFiledbObject] Case where db file is empty and now the new user will be the first user.`,
      );

      // Returning the new user as the first user in the db
      return [newUserEntry];
    } //end of case where the new user is the first user in file database

    this.logger.debug(
      `>> Event >> [userfildb.service-prepUserFiledbObject] Case where the file-db has one or more users.`,
    );

    //* ___Step 3___: If we got to this code block then that means there already exist users in the db.
    //        this means we need to verify taht the new user's values that need to be unique are realy unique.

    // Verifing if the new user's email already exists in the db ('allUsers' array).
    this.logger.debug(
      `>> Event >> [userfildb.service-prepUserFiledbObject] Verifying if email is unique.`,
    );

    const userEmailExists: UserFiledb = allUsers.find(
      ({ emailAddress }) => emailAddress === newUserEntry.emailAddress,
    );

    if (userEmailExists) {
      // Case where the emailAddress is already being used by another user object in the db.
      this.logger.warn(
        `>> Warning >> [userfildb.service-prepUserFiledbObject] The email address "${newUserEntry.emailAddress} already exists.".`,
      );

      throw new UnauthorizedException(`The email address already exists`);
    } //if userEmail already exists

    //* ___Step 4___: Add the new user to creat a new users list (it will overwrite the existing db)
    // Appending the new object to the end of the User array
    newAllUsers = [...allUsers, newUserEntry];

    return newAllUsers;
  }; //end of function setupUserFiledbObject

  /**
   * * updateUserFiledbObject( :UserFiledb)
   * Gets a user object (targetUserObject) as input.
   * It uses its id to find it's pair in the db.
   * So the id is a mandatory demand for the input object and at least one more property.
   *
   * If a matching object in db with same id property value is found then
   * the whole input object overwrites the existing matching object.
   *
   * What this means that properties that are not included in the input object will
   * disapear in the updated db object.
   * Also if you include new properties in the input object then they will
   * be included in the updated db object.
   *
   * The only property that will always apear and never change value is the object's 'id'.
   *
   * Return values:
   * There are 3 options for the return value:
   * (1) undefined means unexpected error,
   * (2) null value means no object in db has a matching id (not found)
   * (3) The input value is returned - this means the update to db was successful.
   *
   * @param {UserFiledb} targetUser
   *
   * @return {Promise<UserFiledb>}
   */
  async updateUserFiledbObject(targetUser: UserFiledb): Promise<UserFiledb> {
    //console.log('====== Starting service [updateUserObject] method ');
    //console.log(`[updateUserObject] Value of targetUser is: ${jsonPrettify(targetUser)}`);
    this.logger.debug(
      `>> Flow: >> Starting >> [userfildb.service-updateUserFiledbObject] `,
    );

    //Step 1: Confirm that at least 2 properties are given in targetUser
    const targetUserLength = Object.keys(targetUser).length;
    if (targetUserLength < 2) {
      // console.warn(
      //   `[updateUserObject] Not enough properties to update, need at least 2 in targetUser`,
      // );
      this.logger.warn(
        `>> WARNINIG >> [userfildb.service-updateUserFiledbObject] Not enough properties to update, need at least 2 in targetUser.`,
      );

      return undefined;
    }

    //Step 2: Confirm that one of the properties is the id
    if (!targetUser.id) {
      // console.warn(
      //   `[updateUserObject] Missing the property 'id' for targetUser`,
      // );
      this.logger.warn(
        `>> WARNINIG >> [userfildb.service-updateUserFiledbObject] Missing the property 'id' for targetUser.`,
      );

      return undefined;
    }

    //Step 3: Get the list of all the users, if failed the return undefined
    const allUsers: UserFiledb[] = await this.getAllUserFiledb();
    if (allUsers === undefined) {
      // console.warn(
      //   '[updateUserObject] Something went wrong, cannot read allUsers from db file.',
      // );
      this.logger.warn(
        `>> WARNINIG >> [userfildb.service-updateUserFiledbObject] Something went wrong, cannot read allUsers from db file.`,
      );

      return undefined;
    }

    //Step 4: Search fo the targetUser in db , if found then overwrite with targetUser
    var isFoundObj: boolean = false;
    const newAllUsers = allUsers.map((obj) => {
      if (obj.id === targetUser.id) {
        //return { ...obj, loginName: targetUser.loginName }; //This will update a specific property
        isFoundObj = true;
        return { ...targetUser }; //This will replace the whole existing user with targetUser
      }
      return obj;
    }); //end const newAllUsers
    if (!isFoundObj) {
      // console.warn(
      //   `[updateUserObject] Could not find object with 'id'='${targetUser.id}'.`,
      // );
      this.logger.warn(
        `>> WARNINIG >> [userfildb.service-updateUserFiledbObject] Could not find object with 'id'='${targetUser.id}'.`,
      );

      return null;
    }

    //Step 5: Write the new updated users list to db (overwritting the prev)
    try {
      await createFile(
        this.dbfilePath,
        this.dbfileName,
        jsonPrettify(newAllUsers),
      );
    } catch {
      //When the createFile fails we return type undefined and log the event.
      // console.warn(
      //   `[addUser] Warning - Failed creating file with deleted object}`,
      // );
      this.logger.warn(
        `>> CATCH EVENT >> [userfildb.service-updateUserFiledbObject] Failed creating file with deleted object.`,
      );

      return undefined;
    }

    return targetUser;
  } ///end of function updateUserFiledbObject

  /**
   * * deleteUserFiledbById( :string)
   * Gets a user ID as input, uses it to find the index location of the matching user object.
   * Removes that object from the User array, then writes the new User array to the db.
   *
   * Returns one of 3 possible results:
   * (1) true if success
   * (2) false if not found the object with the requested input id.
   * (3) undefined if an unexpected error occured
   * @param {string} targetUserId
   *
   * @return {Promise<boolean>}
   */
  async deleteUserFiledbById(targetUserId: string): Promise<boolean> {
    //console.log('====== [deleteUserById] Starting service.');

    //Step 1: Confirm that the input id value exists
    if (!targetUserId) {
      //console.warn('[deleteUserById] Missing value for targetUserId.');
      this.logger.warn(
        `>> WARNINIG >> [userfildb.service-deleteUserFiledbById] Missing value for targetUserId.`,
      );

      return false;
    }

    //Step 2: Fetch the list of all the users in the db
    const allUsers: UserFiledb[] = await this.getAllUserFiledb();
    if (allUsers === undefined) {
      // console.warn(
      //   '[deleteUserById] Something went wrong, cannot read allUsers from db file.',
      // );
      this.logger.warn(
        `>> WARNINIG >> [userfildb.service-deleteUserFiledbById] Something went wrong, cannot read allUsers from db file.`,
      );

      return undefined;
    }

    //Step 3: Find the index location of the target object by its id
    const targetIndexLocation = allUsers.findIndex(
      (item) => item.id === targetUserId,
    );

    if (targetIndexLocation === undefined || targetIndexLocation === -1) {
      // Case not found the user with matching id value
      //console.log(`[deleteUserById] Didnt find object with id ${targetUserId}`);
      this.logger.warn(
        `>> WARNINIG >> [userfildb.service-deleteUserFiledbById] Did not find object with id ${targetUserId}`,
      );

      return false;
    } else {
      //Case found the user with matching id
      allUsers.splice(targetIndexLocation, 1); //This mutates allUsers array

      // console.log(
      //   `[deleteUserById] User with id= '${targetUserId}' was deleted.`,
      // );
      this.logger.verbose(
        `>> FYI >> [userfildb.service-deleteUserFiledbById] User with id= '${targetUserId}' was deleted.`,
      );

      try {
        await createFile(
          this.dbfilePath,
          this.dbfileName,
          jsonPrettify(allUsers),
        );
      } catch {
        //When the createFile fails we return type undefined and log the event.
        // console.warn(
        //   `[deleteUserById] Warning - Failed creating file with deleted object.`,
        // );
        this.logger.warn(
          `>> CATCH EVENT >> [userfildb.service-deleteUserFiledbById] Failed creating file with deleted object.`,
        );

        return undefined;
      }
    } //end else
    return true;
  } //end of deleteUserFiledbById

  /**
   * * deleteAllUsersLogins()
   * Gets nothing as input, just the route itself will trigger a reset of the db to 0 items.
   * Returns true (for success) and failure is either false or undefined.
   *
   * @return {Promise<boolean>}
   */
  async deleteAllUsersLogins(): Promise<boolean> {
    //console.log('====== [deleteAllUsers] Starting service.');
    this.logger.debug(
      `>> Flow: >> Starting >> [userfildb.service- deleteAllUsersLogins] `,
    );

    var isDeleted: boolean = false;

    try {
      await createEmptyFiledb(this.dbfilePath, this.dbfileName);
      //console.warn("Mockup create file to delete all");
      //("");
      isDeleted = true;
    } catch {
      //When the createFile fails we return type undefined and log the event.
      // console.warn(
      //   `[deleteAllUsers] Warning - Failed creating the [] empty db file.`,
      // );
      this.logger.warn(
        `>> CATCH EVENT >> [userfildb.service-deleteAllUsersLogins] Failed creating the [] empty db file.`,
      );

      return undefined;
    }

    return isDeleted;
  } // end deleteAllUsersLogins
} //UserFiledbService
