import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { jsonPrettify } from '../../common/helpers/global.helper';
import { multerOptions } from './common/photos.constant';
import { PhotosService } from './photos.service';
//import { multerOptions } from './common/photos.constant';

@Controller('photos')
export class PhotosController {
  constructor(
    private readonly photosService: PhotosService, //private readonly photosHelper: PhotosHelper,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadSinglePhoto(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imagePath: string }> {
    console.log(
      `Controller-upload: The uploaded file is = ${jsonPrettify(file)}`,
    );

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
  //todo :  Need to catch the error when the file is not found and send a Not Found exception. Currently a movk-505 error is sent because the error code is not accessable/exists.
  seeUploadedFile(@Param('imgpath') image: string, @Res() res) {
    return res.sendFile(image, { root: 'uploads/photos' });
  }
}
