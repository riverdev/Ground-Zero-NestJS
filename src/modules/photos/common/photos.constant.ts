import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';

// setting config values
//todo: Get these values from ConfigModule
const limitSize: number = 4 * 1000000; // converting from Mb to bytes
const regexFileExtensionFilter = /\/(jpg|jpeg|png|gif|bmp)$/;
const storagePath = './uploads/photos';

//todo: Find a way to add validation if file type & content are coherent '.addFileTypeValidator({'

export const multerOptions = {
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
    destination: storagePath,
    filename: (req, file, cb) => {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e5);

      //const ext = parse(file.originalname).ext;
      //const name: string = parse(file.originalname).name;
      const fullFilename = `${uniquePrefix}-${file.originalname}`;

      cb(null, fullFilename);
    },
  }), //end storage prop
};
