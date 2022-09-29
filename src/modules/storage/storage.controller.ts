//storage.controller.ts

import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { multerOptions } from './common/storage.constant';
import { ConfigService } from '@nestjs/config';
import { NotFoundError } from 'rxjs';

//===========================================================

@Controller('storage')
export class StorageController {
  constructor(
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  //===========================================================

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFileToGcpStorage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imagePath: string }> {
    const uniqueFileName = this.storageService.getUniqueFileName(
      file.originalname,
    );

    const uploadPath =
      this.configService.get('STORAGE_UPLOAD_FOLDER_1') + uniqueFileName;
    console.log(`==uploadPath2 = ${uploadPath}`);

    await this.storageService.save(uploadPath, file.mimetype, file.buffer, [
      { mediaId: `The file is "${uniqueFileName}"` },
    ]);

    return { imagePath: uniqueFileName };
  } // end of upload

  //===========================================================

  @HttpCode(204)
  @Delete('/:filepath')
  async delteMedia(@Param('filepath') filepath: string) {
    //const pathMedia:string = filepath;
    await this.storageService.delete(
      this.configService.get('STORAGE_UPLOAD_FOLDER_1') + filepath,
    );
  }
} // end StorageController
