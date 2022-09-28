// import { StorageFile } from './entities/storage-file.object';
import { DownloadResponse, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: configService.get('STORAGE_PROJECT_ID'),

      credentials: {
        client_email: configService.get('STORAGE_CLIENT_EMAIL'),
        private_key: configService.get('STORAGE_PRIVATE_KEY'),
      },
    });

    this.bucket = configService.get('STORAGE_MEDIA_BUCKET');
  }

  /**
   * save (uploads to bucket)
   * @param path
   * @param contentType
   * @param media
   * @param metadata
   */
  async save(
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: string }[],
  ) {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});

    const file = this.storage.bucket(this.bucket).file(path);

    const stream = file.createWriteStream();

    stream.on('finish', async () => {
      return await file.setMetadata({
        metadata: object,
      });
    });
    stream.end(media);
  } //save by path,content-type,media,metadata
}
