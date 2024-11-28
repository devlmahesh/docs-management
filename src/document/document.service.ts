import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document) private documentRepo: Repository<Document>,
  ) {}

  async uploadDocument(file: Express.Multer.File, user: User) {
    const document = new Document();
    document.filename = file.originalname;
    document.path = `uploads/${file.filename}`;
    document.description = 'Test document';
    document.user = user;
    document.createdAt = new Date();
    document.updatedAt = null;
    return this.documentRepo.save(document);
  }

  async getAllDocuments() {
    return this.documentRepo.find();
  }

  async getDocumentById(id: number) {
    return this.documentRepo.findOne({ where: { id } });
  }

  async updateDocument(id: number, updateDocDto: UpdateDocumentDto) {
    await this.documentRepo.update(id, updateDocDto);
    return this.documentRepo.findOne({ where: { id } });
  }

  async deleteDocument(id: number) {
    await this.documentRepo.delete(id);
  }
}
