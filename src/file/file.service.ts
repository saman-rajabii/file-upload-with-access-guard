import { Injectable } from '@nestjs/common';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  fileBuffer(fileName: string) {
    return readFileSync(join(process.cwd(), `/files/${fileName}`));
  }
}
