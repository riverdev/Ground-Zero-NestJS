// /common/photos.constants.ts

import { HttpException, HttpStatus } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';

// setting config values
//todo: Get these values from ConfigModule not hardcoded
const limitSize: number = 4 * 1000000; // converting from Mb to bytes
const regexFileExtensionFilter = /\/(jpg|jpeg|png|gif|bmp)$/;
export const STORAGE_PATH = 'uploads/photos';

export const MULTER_OPTIONS = {
  // Enable file size limits
  limits: {
    fileSize: limitSize,
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
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },

  // Storage options
  storage: diskStorage({
    destination: './' + STORAGE_PATH, //important to prefix with './'
    filename: (req, file, cb) => {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e5);
      const fullFilename = `${uniquePrefix}-${file.originalname}`;
      cb(null, fullFilename);
    },
  }), //end storage prop
};
