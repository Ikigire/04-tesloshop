import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', { 
    fileFilter: fileFilter, 
    // limits: { fileSize: 10000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    }) 
  }) )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {

    if (!file) {
      throw new BadRequestException('Please make sure that the file is provided and is an image');
    }

    return this.filesService.uploadProductImage(file);
  }
  
  @Get('product/:imageName')
  getProductImage(
    @Res() response: Response,
    @Param('imageName') imageName: string
  ) {

    console.log(imageName);
    
    const path = this.filesService.getStaticProductImage(imageName);

    response.sendFile(path);
  }
}
