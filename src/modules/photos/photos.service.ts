import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class PhotosService {
  getMulterOptions(
    sizeLimitMegaBytes: number,
    rootStorage: string,
    subrootPathStorage: string,
  ): any {
    // Managing the file size limit configuration
    let sizeLimitBytes: number = 2000000;
    if (!sizeLimitMegaBytes) {
    } else {
      sizeLimitBytes = sizeLimitMegaBytes * 1000000; //Multiply by 1 milloion to turn Mb to bytes
    }

    // Managing the storage destination path configuration
    if (!rootStorage) {
      rootStorage = 'uploads';
    }

    if (!subrootPathStorage) {
      subrootPathStorage = '';
    }

    const storageDestination = rootStorage + '/' + subrootPathStorage;

    // Setting the options:

    const multerOptions = {
      // Enable file size limits
      // limits: {
      //   fileSize: +process.env.MAX_FILE_SIZE,
      // },
      // Check the mimetypes to allow for upload
      fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
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
        destination: './uploads/photos',
        filename: (req, file, cb) => {
          const uniquePrefix =
            Date.now() + '-' + Math.round(Math.random() * 1e5);

          //const ext = parse(file.originalname).ext;
          //const name: string = parse(file.originalname).name;
          const fullFilename = `${uniquePrefix}-${file.originalname}`;

          cb(null, fullFilename);
        },
      }), //end storage prop
    };

    return multerOptions;
  } //end of getMulterOptions
} //end of PhotosService
