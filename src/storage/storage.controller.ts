import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import {
  multerOptions,
  multerOptions2,
} from '../modules/photos/common/photos.constant';
import { jsonPrettify } from '../common/helpers/global.helper';
//import { PhotosService } from '../modules/photos/photos.service';

@Controller('storage')
export class StorageController {
  constructor(
    private readonly storageService: StorageService,
  ) // private readonly photosService: PhotosService,
  {}

  @Post()
  // @UseInterceptors(
  //   FileInterceptor("file", {
  //     limits: {
  //       files: 1,
  //       fileSize: 1024 * 1024,
  //     },
  //   })
  @UseInterceptors(
    FileInterceptor('file', multerOptions2),

    //todo: Probably need to configure the file name here - verify
    //todo: Currently the file.filename property returns "undefined"
  )
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body('mediaId') mediaId: string,
  ) {
    console.log(`===file.mimetype = ${file.mimetype}`);
    console.log(`===file.filename = ${file.filename}`);

    await this.storageService.save(
      'media/' + mediaId,
      file.mimetype,
      file.buffer,
      [{ mediaId: mediaId }],
    );
  }

  //===========================================================

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions2))
  async uploadFileToGcpStorage(
    @UploadedFile() file: Express.Multer.File,
    //@Body("mediaId") mediaId: string
  ) /*: Promise<{ imagePath: string }> */ {
    //todo-future:
    //todo: The following comented out section that checks the content type currently doesnt work because we need to upload the file locally to the server for the "photosService.isLegitContentForExtension" to work.
    //todo this means 2 uploads, one to the server then if OK again upload but this time to gcloud storage, although that can be done async using a cron job that runs once every x time.
    // Verify if the file is really the type its supposed to be (as its extension says it is)

    // const isContentTypeLegit =
    //   await this.photosService.isLegitContentForExtension(file.path);

    // // If it is not then remove the file from local storage and throw an error.
    // if (!isContentTypeLegit) {
    //   //this.photosService.removeFile(file.path);
    //   throw new BadRequestException(
    //     `The file [${file.path}] content does not match the file extension type.`,
    //   );
    // }

    // console.log(
    //   `Controller-upload: The uploaded file is = ${jsonPrettify(file)}`,
    // );
    // console.log(`===file.mimetype = ${file.mimetype}`);
    // console.log(`===file.filename = ${file.filename}`);
    // console.log(`===file.originalName = ${file.originalname}`);

    await this.storageService.save(
      'media/' + 'lala.png', //file.filename,
      file.mimetype,
      file.buffer,
      [{ mediaId: 'lala.png' }], //file.filename }]
    );

    //return { imagePath: file.path };
  }
}
