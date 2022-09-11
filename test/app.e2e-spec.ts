//* app.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
//import { setupApp } from './../src/setup-app';

describe('=== App Module e2e Test ===', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    //setupApp(app); //This is called after we make an instance (named 'app') of our Nest Application
    
    await app.init();
  });

  it('Lists all users in database', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      ;
      //.expect('Hello World!');
  });

});
