import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserFiledbDto } from './dtos/create-userfildb.dto';
import { FilterUserFiledbDto } from './dtos/filter-userfiledb.dto';
import { UpdateUserFiledbDto } from './dtos/update-userfiledb.dto';
import { UserFiledb } from './entities/userFiledb.object';
import { UserFiledbService } from './userfiledb.service';

describe('=== FiledbService Testing ===', () => {
  //Setup-1: Global setting for services
  let service: UserFiledbService;

  const testUser: CreateUserFiledbDto = {
    loginName: 'Test User',
    emailAddress: 'test@user.com',
    roles: ['place-holder-role'],
    passwordHash: 'test123',
    hashRefreshToken: 'place-holder-refresh-token',
  };

  const FILEDB_PATH: string = './test/user-filedb-test-data/';
  // The dynamic file is used in the test dynamically (created, deleted , updated ...)
  const FILEDB_FILENAME_DYNAMIC: string = 'user.filedb.dynamic.test.json';
  //The static file is used in the tests as a pre-determined constant value file
  // This is used to test filter, read.
  //! DO NOT CREATE/DELETE this file or it's objects - that will break the tests using it.
  //! DO NOT UPDATE any object except the one dedicated for update (id= 'U-CAN-ONLY-UPDATE-MY-OBJECT')
  const FILEDB_FILENAME_STATIC: string = 'user.filedb.static.test.json';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFiledbService],
    }).compile();

    service = module.get<UserFiledbService>(UserFiledbService);
    service.dbfilePath = FILEDB_PATH;
    service.dbfileName = FILEDB_FILENAME_DYNAMIC;
  });

  const setDbFileDynamic = () => {
    service.dbfileName = FILEDB_FILENAME_DYNAMIC;
  };
  const setDbFileStatic = () => {
    service.dbfileName = FILEDB_FILENAME_STATIC;
  };

  it('deletes all users', async () => {
    setDbFileDynamic();
    expect(await service.deleteAllUsersLogins()).toBeTruthy();
  });

  it('adds a user succesfully returning the new user', async () => {
    setDbFileDynamic();

    const result: UserFiledb = await service.addUserFiledb(testUser);

    expect(result.loginName).toEqual(testUser.loginName);
    expect(result.emailAddress).toEqual(testUser.emailAddress);
    expect(result.passwordHash).toEqual(testUser.passwordHash);
  });

  it('Can update a user object and returns null if id doesnt match.', async () => {
    setDbFileStatic();

    //This updateUsersDtoObj simulates an input received via url
    const updateUserDtoObj: Partial<UpdateUserFiledbDto> = {
      //using partial thus simulating partial input in UpdateUserDto
      //Here we are not inputting the optional orderCount & passwordHash properties
      id: 'U-CAN-ONLY-UPDATE-MY-OBJECT',
      loginName: 'Test-Update-UserName',
      emailAddress: 'update1-test@lala.com',
      //userCount: 9 //Optional and not used in this test
      //passwordHash: 'Aa*' //Optional and not used in this test
    };

    //We need to convert from the type UpdateUserDto to the User type
    const updateUser: UserFiledb = updateUserDtoObj as UserFiledb;

    // First test: We update the default value of the user with our test value
    const result1: UserFiledb = await service.updateUserFiledbObject(
      updateUser,
    );
    expect(result1.loginName).toEqual('Test-Update-UserName');

    // Second Test: We update back from the test value to the default value
    updateUser.loginName = 'Default-Update-UserName';
    const result2: UserFiledb = await service.updateUserFiledbObject(
      updateUser,
    );
    expect(result2.loginName).toEqual('Default-Update-UserName');

    // Third Test: Return null if user id doesnt match the db
    updateUser.id = 'no-such-id-exists-in-db';
    expect(await service.updateUserFiledbObject(updateUser)).toBeNull();
  });

  // This "read-all" test runs on the STATIC filedb file, that way it is not dependent
  // on other functionaility such as creation of the file (that is for e2e tests).
  it("Reads all users checking 3rd user's name and the total number of users", async () => {
    setDbFileStatic();

    const userList: UserFiledb[] = await service.getAllUserFiledb();
    expect(userList[2].loginName).toEqual('Jane');
    expect(userList.length).toEqual(6);
  });

  it('Finds users using a FilterUsersDto object as a search filter', async () => {
    setDbFileStatic();

    //This FilterUsersDto simulates an filter input received via url
    //The search filter here is for all users with specific name AND email
    // There are 2 items with same name & email in the static test db
    const filterUserDtoObj: Partial<FilterUserFiledbDto> = {
      //using partial thus simulating partial input in FilterUsersDto
      //Here we are not inputting the optional orderCount & passwordHash properties
      //id: 'id is optional',  //Optional
      loginName: 'NoName', //Optional
      //passwordHash: 'optional',                //Optional
      emailAddress: 'info@fdfd.com', //Optional
    };

    // First test : Use name & email to filter out users
    let userList: UserFiledb[] = await service.getfilteredUserFiledb(
      filterUserDtoObj,
    );
    expect(userList[1].emailAddress).toEqual('info@fdfd.com');
    expect(userList.length).toEqual(2);

    // Second test : Use one property to filter out all users with same email
    delete filterUserDtoObj.loginName;
    userList = await service.getfilteredUserFiledb(filterUserDtoObj);
    expect(userList.length).toEqual(3);

    //Third Test : Filter by value that doesnt exist
    filterUserDtoObj.loginName = 'name-that-doesnt-exist-in-db';
    userList = await service.getfilteredUserFiledb(filterUserDtoObj);
    expect(userList).toEqual(undefined);
  });

  it('Returns false trying to delete a user with id that doesnt exist', async () => {
    setDbFileDynamic();

    expect(await service.deleteUserFiledbById('NoSuchUserId')).toBeFalsy();
  });
}); //end describe
