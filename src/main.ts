//* main

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import getLogLevels from './common/helpers/logger.helper';
// import { setupApp } from './setup-app';

async function bootstrap() {
  console.log(`NODE_ENV="${process.env.NODE_ENV}"`);
  const app = await NestFactory.create(AppModule, {
    //If this is a 'prod' run then we set to production logger levels
    logger: getLogLevels(process.env.NODE_ENV === 'prod'),
  });

  //* If you want to use the setup solution based on setupApp(app)
  //* then uncomment the call below to setupApp(app) and its import above.

  //* Also, in the Appmodule providers you need to comment the providers
  //* used in the setupApp() function (i.e. Validation Pipe...).

  // setupApp(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('GroundZero example')
    .setDescription('The GroundZero API description')
    .setVersion('1.0')
    .addTag('GroundZero')
    .addBasicAuth()
    // .addSecurity('basic', {
    //   type: 'http',
    //   scheme: 'basic',
    // })
    // .addBearerAuth(
    //   { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
    //   'access-token',
    // )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
  console.log(
    `\n ########### \n Application is running on: ${await app.getUrl()} \n ########### `,
  );
}
bootstrap();
