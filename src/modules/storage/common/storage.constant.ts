// storage.constants.ts

import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

// setting config values
//todo: Get these values from ConfigModule not hardcoded
const maxNumberOfFiles: number = 1;
const limitFileSizeBytes: number = 2 * 1024 * 1024; // Limiting to 2MB // converting from Mb to bytes
const regexFileExtensionFilter = /\/(jpg|jpeg|png|gif|bmp)$/;
export const STORAGE_PATH = './uploads/photos';

export const multerOptions = {
  // Enable file size limits
  limits: {
    files: maxNumberOfFiles,
    fileSize: limitFileSizeBytes,
  },

  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype.match(
        regexFileExtensionFilter,
      ) /* A regex of file extensions */
    ) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        //todo-glitch When this error is triggered then, in postman, any following request I send will freeze
        //todo      in the "Sending Request..." state forever (doesnt timeout).
        //todo     I tested in chrome-browser and the glitch doesnt happen (I only tested the download endpoint).
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
}; //end const multerOptions
