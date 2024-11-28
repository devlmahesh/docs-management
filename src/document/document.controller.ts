import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../decorators//user.decorators';
import { UserService } from '../user/user.service';

@Controller('documents')
@UseGuards(RolesGuard)
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly userService: UserService,
  ) {}

  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads', // Define the destination folder for the uploaded files
    }),
  )
  @Post('file')
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @User() user: any,
  ) {
    if (!file) {
      throw new BadGatewayException('No file uploaded');
    }

    try {
      const existingUser = await this.userService.findOneById(user.id);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      const savedDocument = await this.documentService.uploadDocument(
        file,
        existingUser,
      );
      return {
        message: 'File uploaded successfully',
        document: savedDocument,
      };
    } catch (error) {
      console.log('upload failed', error);
    }
  }

  @Get()
  getAll() {
    return this.documentService.getAllDocuments();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.documentService.getDocumentById(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id') id: number) {
    return this.documentService.deleteDocument(id);
  }
}
