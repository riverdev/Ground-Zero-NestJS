//* http-error.filter.ts

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
//import { IncomingMessage } from 'http';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const status = exception.getStatus();
    //const respMessage: string =  JSON.stringify(exception);

    //Feature-1: Custom tailored error response
    const errResponse = {
      code: status,
      name: exception.name,
      timestamp: new Date().toLocaleDateString(),
      path: req.url,
      method: req.method,
      message: exception || null,
    };

    res.status(status).json(errResponse);

    //Feature-2: Custom error logging we log the whole errResponse we created above
    Logger.error(
      `[${errResponse.code}] Custom error :\n (1) Request was: [${
        req.method
      }] on url "${req.url}" \n (2) Response was ${JSON.stringify(
        exception,
        null,
        2,
      )}`,
      //{JSON.stringify(errResponse,null,2)}`,
      exception.stack,
      'MyExceptionFilter',
    );
  }
}
