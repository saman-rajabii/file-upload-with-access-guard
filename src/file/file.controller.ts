import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { FileService } from './file.service';
import { diskStorage } from 'multer';
import { AccessCheck } from 'src/guards/accessGuard';

function editFileName(req, file, callback) {
  console.log(file);

  const name = file.originalname.split('.')[0];
  const extension = extname(file.originalname);
  const ip = req.ip;
  console.log(`${name}-${ip}${extension}`);

  callback(null, `${name}-${ip}${extension}`);
}

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
    }),
  )
  async upload(@UploadedFile() file) {
    console.log(file);

    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Get('download/:fileName')
  @AccessCheck()
  download(@Param('fileName') fileName: string) {
    const file = this.fileService.fileBuffer(fileName);
    return file;
  }
}
