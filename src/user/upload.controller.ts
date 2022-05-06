import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { API_HOST, UPLOAD_FILES_FOLDER } from 'src/common/constants'

@Controller('upload')
export class UploadController {
  @Post('user-avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: `./${UPLOAD_FILES_FOLDER}`,
        filename(_, file, callback) {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          return callback(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file) {
    return {
      url: `${API_HOST}${file.path}`,
    }
  }

  @Get(':path')
  async getImage(@Param('path') path: string, @Res() res: Response) {
    res.sendFile(path, { root: UPLOAD_FILES_FOLDER })
  }
}
