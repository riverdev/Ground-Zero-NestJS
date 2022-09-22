//* http-error.filter.ts

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    let status: number;
    let tryCatchStatusMessage: string = '';

    try {
      status = exception.getStatus();
    } catch (error) {
      const errorName = exception.name;
      switch (errorName) {
        case 'CastError':
          status = 404;
          tryCatchStatusMessage = 'Not Found Error';
          console.log(
            'Got a "CastError" which means "400-Not found error" in case of MongoDB',
          );
          break;
        default:
          status = 505;
          tryCatchStatusMessage = `Got error with no status code, its\n name is  ${errorName}, it will get error code 505 as place holder.`;
          console.log(
            `Got a ${errorName} error we did not program a reaction, so we give it code 505 as default.`,
          );
      }
    }

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
      `[${
        errResponse.code
      }] Custom error : ${tryCatchStatusMessage} \n (1) Request was: [${
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
