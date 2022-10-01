// photos.service.ts

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
const FileType = require('file-type');
import { join } from 'path';

@Injectable()
export class PhotosService {
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
