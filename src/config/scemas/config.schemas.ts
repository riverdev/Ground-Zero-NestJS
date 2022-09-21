//* config.schema.ts

import * as Joi from 'joi';

export const configValidation = Joi.object({
  PORT: Joi.number().default(8080),

  MY_ENV_VAR_NAME: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_LOCAL_FILE_PATH: Joi.string().required(),
  DB_LOCAL_FILENAME: Joi.string().required(),

  MONGODB_URI: Joi.string().required(),
});
