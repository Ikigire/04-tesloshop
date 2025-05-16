import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import path, { join } from 'path';

@Injectable()
export class FilesService {

  constructor(
    private readonly configService: ConfigService,
  ) {}

  uploadProductImage(file: Express.Multer.File) {
    // Logic to upload the product image
    // This could involve saving the file to a cloud storage or local storage
    // and returning the URL of the uploaded image.
    const secureUrl = this.configService.get('HOST_API') + '/api/v1/files/product/' + file.filename;
    return {
      secureUrl
    };
  }

  getStaticProductImage(imageName: string) {
    // Logic to retrieve the static product image
    // This could involve returning the file from local storage or cloud storage

    console.log(imageName);
    

    const filePath = join(__dirname, '..', '..', 'static', 'products', imageName);

    if ( !existsSync( filePath ) ) throw new NotFoundException('File not found for product');

    return filePath;
  }
}
