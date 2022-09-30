//storage.controller.ts

import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
  ServiceUnavailableException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { multerOptions } from './common/storage.constant';
import { ConfigService } from '@nestjs/config';
import { StorageFile } from './entities/storage-file.object';

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
  @Delete('/:filename')
  async delteMedia(@Param('filename') fileName: string) {
    //const pathMedia:string = filepath;
    await this.storageService.delete(
      this.configService.get('STORAGE_UPLOAD_FOLDER_1') + fileName,
    );
  }

  //===========================================================

  @HttpCode(200)
  @Get('/:filename')
  async downloadFile(
    @Param('filename') fileName: string,
    @Res() res: Response,
  ) {
    let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.getImage(
        this.configService.get('STORAGE_UPLOAD_FOLDER_1') + fileName,
      );
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        throw new NotFoundException(`File named '${fileName}' was not found.`);
      } else {
        throw new ServiceUnavailableException(
          `Internal error when trying to download file '${fileName}'.`,
        );
      }
    }

    //todo-bug: Verify why this res.setHeader gives error: "Content type undefined in header"
    //res.setHeader("Content-Type", storageFile.contentType);
    res.setHeader('Cache-Control', 'max-age=60d');
    res.end(storageFile.buffer);
  } //end downloadFile

  //===========================================================
} // end StorageController
