//* app.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
//*We dont want to import AppModule, it causes issues when connecting to databases
//import { AppModule } from '../src/app.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from '../src/common/helpers/env.helper';
import { configValidation } from '../src/config/scemas/config.schemas';
import { UserFiledbModule } from '../src/modules/user-filedb/userfiledb.module';
//import { setupApp } from './../src/setup-app';

describe('=== App Module e2e Test ===', () => {
  let app: INestApplication;

  const mystr = process.cwd();
  const pathForEnvFile: string = getEnvPath(`${mystr}/src/config/envs`);
  
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
      providers: [AppService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();

    //setupApp(app); //This is called after we make an instance (named 'app') of our Nest Application

    await app.init();
  });

  it('Lists all users in database', () => {
    return request(app.getHttpServer()).get('/user').expect(200);
    //.expect('Hello World!');
  });
});
