import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { DocumentService } from './document.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('documents')
@UseGuards(RolesGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @Roles(Role.ADMIN, Role.EDITOR)
  upload(@Body() file: Express.Multer.File) {
    return this.documentService.uploadDocument(file);
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
