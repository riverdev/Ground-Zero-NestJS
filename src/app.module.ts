//* app.module.ts
import {
  Logger,
  MiddlewareConsumer,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helpers/env.helper';
import { configValidation } from './config/scemas/config.schemas';
import LogsMiddleware from './common/middlewares/logs.middleware';
import { NotesModule } from './modules/notes/notes.module';
import { UserFiledbModule } from './modules/user-filedb/userfiledb.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { UserFiledbService } from './modules/user-filedb/userfiledb.service';
import { AuthFbModule } from './auth-fb/auth-fb.module';
import { FirebaseService } from './firebase/firebase.service';

//const envVarFolderPath = '/common/envs'; //'/config/envs';
//const pathForEnvFile: string = getEnvPath(__dirname+envVarFolderPath);
//const pathForEnvFile: string = getEnvPath(`${__dirname}/common/envs`);
const pathForEnvFile: string = getEnvPath(`${__dirname}/config/envs`);

console.log(`====   pathForEnvFile = "${pathForEnvFile}"`);
//todo How to add the logger to AppModule ?

@Module({
  imports: [
    NotesModule,

    ConfigModule.forRoot({
      //the forRoot method of ConfigModule loads the .env key-bvalues
      //and also the system env vars.
      envFilePath: pathForEnvFile,
      isGlobal: true,
      validationSchema: configValidation,
    }),

    UserFiledbModule,

    //todo: Learn how to run e2e tests when firebase is associated to AppModule
    //todo: The run flow seems to pass through AuthFbModule && FirebaseService
    //todo: causing an error:  "FirebaseError: Firebase: Error (auth/invalid-api-key)""
    //todo: Mayne there is a way to ingore specific imports & provuders in e2e tests
    //todo: FYI: For firebase testing there is a specific library/tool.
    //* In order to run e2e tests need to comment out (otherwise e2e fails):
    //* imports:    AuthFbModule
    //* providers: FirebaseService
    AuthFbModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserFiledbService,

    //HttpErrorFilter: Adding a global scoped filter, you can add multiple filters here
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },

    //==========================================
    {
      //Start of a validation pipe object
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },

    //todo: Learn how to run e2e tests when firebase is associated to AppModule
    //todo: The run flow seems to pass through AuthFbModule && FirebaseService
    //todo: causing an error:  "FirebaseError: Firebase: Error (auth/invalid-api-key)""
    //todo: Mayne there is a way to ingore specific imports & provuders in e2e tests
    //todo: FYI: For firebase testing there is a specific library/tool.
    //* In order to run e2e tests need to comment out (otherwise e2e fails):
    //* imports:    AuthFbModule
    //* providers: FirebaseService
    FirebaseService,

    //end of the validation pipe object
    //==========================================

    //==========================================
    // You can add more provider objects here
    // {
    //    provide: lala
    //    useValue: values that lala needs
    // },
    //==========================================
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppController.name);

  //==========================================
  // This code section is where we add Global middleware
  // In this case we are defining the LogsMiddleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*'); //Apply to all the routes in the app
  }
  //==========================================
}
