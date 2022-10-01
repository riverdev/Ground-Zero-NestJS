// photos.controller.ts

import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MULTER_OPTIONS, STORAGE_PATH } from './common/photos.constant';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(
    private readonly photosService: PhotosService, //private readonly photosHelper: PhotosHelper,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async uploadSinglePhoto(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imagePath: string }> {
    // console.log(`Controller-upload: The uploaded file is = ${jsonPrettify(file)}`);

    // Verify if the file is really the type its supposed to be (as its extension says it is)
    const isContentTypeLegit =
      await this.photosService.isLegitContentForExtension(file.path);

    // If it is not then remove the file from local storage and throw an error.
    if (!isContentTypeLegit) {
      this.photosService.removeFile(file.path);
      throw new BadRequestException(
        `The file [${file.path}] content does not match the file extension type.`,
      );
    }

    //otherwise return the file's path as an object
    return { imagePath: file.path };
  }

  @Get(':imgpath')
  //todo : How to send a custom NotFoundException in case cannot find the file ?
  //todo : It most probably has to be causght in the MULTER_OPTIONS configuration logic.
  //todo : In the current state the error is caught before my try-catch and gives a default error, not
  //todo : a customized error. I catch the default multer error with my My HttpErrorFilter
  //todo : but has no logic to know the reason is "file-not-found" so it returns a 505 error.
  async uploadFile(@Param('imgpath') imageToDownload: string, @Res() res) {
    //let fileDownloaded: any ;
    try {
      //todo: This try-catch never catches errors, they are intercepted by the 'HttpErrorFilter'
      //todo: The trigger for the error happens before it gets to this route and before it gets to the error-filter
      return res.sendFile(imageToDownload, { root: STORAGE_PATH });
    } catch (error) {
      throw new NotFoundException(
        `Could not find a file named ${imageToDownload} on the server.`,
      );
    }

    //return fileDownloaded;
  }

  @HttpCode(204)
  @Delete(':photoPath')
  async removeImage(@Param('photoPath') photoPath: string) {
    try {
      this.photosService.removeFile(STORAGE_PATH + '/' + photoPath);
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not delete file [${
          STORAGE_PATH + '/' + photoPath
        }] either doesnt exist or something else went wrong.`,
      );
    } //catch
  } // end route removePhoto
}
