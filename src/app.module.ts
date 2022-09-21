//* app.module.ts
import {
  Logger,
  MiddlewareConsumer,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { MongooseModule } from '@nestjs/mongoose';

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
      envFilePath: pathForEnvFile,
      isGlobal: true,
      validationSchema: configValidation,
    }),

    UserFiledbModule,

    // MongooseModule.forRoot('xxxmongodb+srv://xxxmyuser:nopassw@cluster4booksdb.5yycafu.mongodb.net/mydb?retryWrites=true&w=majority'),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        //useNewUrlParser: true
      }),
      inject: [ConfigService],
    }),
  ], //end imports

  controllers: [AppController], //end controllers

  providers: [
    AppService,
    UserFiledbService,

    //Adding a global scoped filter, you can add multiple filters here
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

    //end of the validation pipe object
    //==========================================

    //==========================================
    // You can add more provider objects here
    // {
    //    provide: lala
    //    useValue: values that lala needs
    // },
    //==========================================
  ], //end providers
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
