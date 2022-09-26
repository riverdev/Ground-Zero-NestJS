import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
const FileType = require('file-type');
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { jsonPrettify } from '../../common/helpers/global.helper';
//import { STORAGE_PATH as STORAGE_PATH } from './common/photos.constant';
//import { lastValueFrom, NotFoundError } from 'rxjs';

@Injectable()
export class PhotosService {
  getMulterOptions(
    sizeLimitMegaBytes: number,
    rootStorage: string,
    subrootPathStorage: string,
  ): any {
    // Managing the file size limit configuration
    if (!sizeLimitMegaBytes) {
      sizeLimitMegaBytes = 2; /* Default limit is 2 MB*/
    }
    //Convert MB to bytes
    const sizeLimitBytes: number = sizeLimitMegaBytes * 1000000;

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
      //Check file size limits
      limits: {
        fileSize: sizeLimitBytes,
      },

      //Check that the mimetypes (file extensions) are legit
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
        destination: storageDestination,
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

  /**
   * Tis method verifies if a file's format/content is as it's extension syays it is.
   * That means that if the extensin is jpg then the file is realy jpg (and not a worddoc).
   *
   *
   * @param filePath : string
   *  Example of filePath:  [uploads\\photos\\my-image.png]
   * @returns any // If value is falsy (like undefined) the file is not legitement
   */
  async isLegitContentForExtension(filePath: string): Promise<any> {
    const fullFilePath = join(process.cwd(), filePath);
    //console.log(`fullFilePath = ${fullFilePath}`);

    let isLegitFile: any;
    try {
      isLegitFile = await FileType.fromFile(fullFilePath); //fileTypeFromFile(fullFilePath);
    } catch (error) {
      throw new NotFoundException(
        `Could not find file in fullpath = ${fullFilePath}`,
      );
    }
    return isLegitFile; //if value is undefined that means the file is NOT legit
  }

  /**
   * This method receives a filePath to a file under the root of the app folder,
   * then it creates a full path by attaching it to process.cmd()
   * and then removes the file from the local disk.
   * @param filePath : string
   *  Example of filePath:  [uploads\\photos\\my-image.png]
   */
  removeFile(filePath: string) {
    const fullFilePath = join(process.cwd(), filePath);
    try {
      fs.unlinkSync(fullFilePath);
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not remove/delete file = ${fullFilePath}`,
      );
    }
  }
} //end of PhotosService
