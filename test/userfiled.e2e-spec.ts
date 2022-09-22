//* app.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
//*We dont want to import AppModule, it causes issues when connecting to databases
//import { AppModule } from '../src/app.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { CreateUserFiledbDto } from '../src/modules/user-filedb/dtos/create-userfildb.dto';
import { jsonPrettify } from '../src/common/helpers/global.helper';
import { UserFiledb } from '../src/modules/user-filedb/entities/userFiledb.object';
import { UserFiledbService } from '../src/modules/user-filedb/userfiledb.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from '../src/common/helpers/env.helper';
import { configValidation } from '../src/config/scemas/config.schemas';
import { UserFiledbModule } from '../src/modules/user-filedb/userfiledb.module';
//import { User } from '../src/user-filedb/entities/user.object';
//import { setupApp } from './../src/setup-app';

describe('=== User file based db system ===', () => {
  //! This test uses the production 'user.filedb.json' file.
  //* It creates a new user item, updates it then deletes it.
  //* What this e2e test does:
  //*   (1) Validates that the user filedb exists and OK
  //*   (2) Adds a new user to the db.
  //*   (3) Does a filter search to find the new user.
  //*   (4) Updates the new user.
  //*   (5) Fails to deletes the new user because wrong id.
  //*   (6) Success deleteing the new user by its id.
  //*   (7) Searches for the deleted user and wont find it
  //*
  //! WARNING: If the test new user object exists for some reason in the filedb
  //!          then the test will fail (step 3 filter search test).
  //!          You must make sure that in the fildb there is no test user (will have
  //!          values identical to the createUserDto values.)
  //*
  //*  The current version of this test doesnt use a private filedb but instead shares
  //*  the filedb with production which is bad practice.
  //*
  //todo Add feature with config Module so that this test will have its private filedb
  //todo     not the one used for unit tests or the one for production.
  //todo     Then the e2e test can begin by delete all users to the existing filedb
  //todo     and the following tests can start with a clean user db and the above
  //todo     highlighted WARNING will not be relavent, no manual managment of the filedb needed

  let app: INestApplication;
  let newlyAddedUser: UserFiledb;

  const mystr = process.cwd();
  //const pathOfSrc = mystr.substring(0, mystr.lastIndexOf(""));

  const pathForEnvFile: string = getEnvPath(`${mystr}/src/config/envs`);

  //console.log(`\n====   pathForEnvFile = "${pathForEnvFile}"  \n ==== mystr = ${mystr}`);

  const createUserDto: CreateUserFiledbDto = {
    loginName: 'Test',
    roles: ['place-holder-role'],
    emailAddress: 'test@user.com',
    passwordHash: 'tesT*',
    hashRefreshToken: 'place-holder-refresh-token',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: pathForEnvFile,
          isGlobal: true,
          validationSchema: configValidation,
        }),

        UserFiledbModule,
      ],
      controllers: [AppController],
      providers: [AppService, ConfigService, UserFiledbService],
    }).compile();

    app = moduleFixture.createNestApplication();

    //setupApp(app); //This is called after we make an instance (named 'app') of our Nest Application

    await app.init();
  });

  // (1) Validates that the user filedb exists and OK
  it('Lists all users in database', async () => {
    return request(app.getHttpServer()).get('/user').expect(200);
    //.expect('Hello World!');
  });

  // (2) Adds a new user to the db.
  it('Adds a user to the database', async () => {
    return request(app.getHttpServer())
      .post('/user/add')
      .send(createUserDto)
      .expect(201)
      .then((res) => {
        newlyAddedUser = res.body;

        expect(newlyAddedUser.loginName).toEqual(createUserDto.loginName);
        expect(newlyAddedUser.emailAddress).toEqual(createUserDto.emailAddress);
        expect(newlyAddedUser.passwordHash).toEqual(createUserDto.passwordHash);
      });
  });//end of adds a new user

  //(3) Does a filter search to find the new user.
  it('Can search for and get the new user by filter values', async () => {
    const filterString = `/user?emailAddress=${newlyAddedUser.emailAddress}&&loginName=${newlyAddedUser.loginName}`;

         //console.log(`\n ===========   filterString = "${filterString}"`);

    return request(app.getHttpServer())
      .get(filterString)
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.length).toEqual(1);
        //console.log(`[filter] The res body is \n`,jsonPrettify(res.body));

        const response = res.body[0];
        expect(response.id).toEqual(newlyAddedUser.id);
        expect(response.passwordHash).toEqual(newlyAddedUser.passwordHash);
      });
  }); //end of search for the new user

  // (4) Updates the new user.
  it('Updates the user that was just added', async () => {
    //console.log(`[Add] The createUserDto is "${jsonPrettify(createUserDto)}"`);
    // console.log(
    //   `[Add] The newlyAddedUser is "${jsonPrettify(newlyAddedUser)}"`,
    // );

    const updatedUser: UserFiledb = {
      id: newlyAddedUser.id,
      loginName: 'Updated',
      emailAddress: 'updated@email.com',
      passwordHash: 'Upd*t',
      roles: ['role1', 'role2'],
      passwordSalt: 'place-holder',
      hashAlgorithm: 'place-holder',
      confirmationToken: 'place-holder',
      hashRefreshToken: 'place-holder',
      tokenGenerationTime: 'place-holder',
      tokenExpirationTime: 'place-holder',
      emailValidationStatus: 'place-holder',
      //  orderCount: newlyAddedUser.orderCount,
    };
    //console.log(`[Add] The updatedUser is "${jsonPrettify(updatedUser)}"`);

    return request(app.getHttpServer())
      .patch('/user')
      .send(updatedUser) //globalUser)//testUser)
      .expect(200)
      .then((res) => {
        const resBody = res.body;
        //console.log(`The res body is \n`, resBody);
        expect(resBody.loginName).toEqual(updatedUser.loginName);
        expect(resBody.emailAddress).toEqual(updatedUser.emailAddress);
        expect(resBody.passwordHash).toEqual(updatedUser.passwordHash);
        //todo expect(resBody.passwordSalt).toEqual(updatedUser.passwordSalt);
        // expect(resBody.orderCount).toEqual(updatedUser.orderCount);
      });
  }); //end it update

  // (5) Fails to deletes the new user because wrong id.
  it('Fails to delete using wrong user id.', async () => {
    return request(app.getHttpServer())
      .delete(`/user?id=wrong-user-id`)
      .expect(404);
  }); //end it fails delete

  // (6) Success deleteing the new user by its id.
  it('Deletes the newly added and updated user.', async () => {
    return request(app.getHttpServer())
      .delete(`/user?id=${newlyAddedUser.id}`)
      .expect(204)
      .then((res) => {
        expect(res).toBeDefined();
      });
  }); //end it delete

  // (7) Searches for the deleted user and wont find it
  it('Wont find the delted user by searching for its user id', async () => {
    //jest.setTimeout(10000); //10sec
    return request(app.getHttpServer())
      .get(`/user?id=${newlyAddedUser.id}`)
      .expect(404);
    // .then((res) => {
    //   expect(res).toThrowError();
    // });
  });
}); //end describe
