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

  async uploadDocument(file: Express.Multer.File) {
    const document = new Document();
    document.filename = file.filename;
    document.path = file.path;
    document.description = 'Test document'; // Add description (or set it dynamically)
    document.user = new User(); // Mock or fetch user (set user as required)
    document.createdAt = new Date(); // Set createdAt date
    document.updatedAt = null; // Set updatedAt (nullable)

    return this.documentRepo.save(document); // Save the complete document
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
