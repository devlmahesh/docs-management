import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { User } from '../user/entities/user.entity'; // Import User entity
import { UpdateDocumentDto } from './dto/update-document.dto';

describe('DocumentService', () => {
  let service: DocumentService;
  let repo: Repository<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    repo = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllDocuments', () => {
    it('should return an array of documents', async () => {
      const user = new User(); // Mock User entity
      user.id = 1;
      user.username = 'testuser';

      const documents = [
        {
          id: 1,
          filename: 'doc1.pdf',
          path: 'uploads/doc1.pdf',
          description: 'First document',
          user: user,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          filename: 'doc2.pdf',
          path: 'uploads/doc2.pdf',
          description: 'Second document',
          user: user,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock the find method of the repository
      jest.spyOn(repo, 'find').mockResolvedValue(documents);

      const result = await service.getAllDocuments();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(documents);
    });
  });

  describe('getDocumentById', () => {
    it('should return a document by id', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'testuser';

      const document = {
        id: 1,
        filename: 'doc1.pdf',
        path: 'uploads/doc1.pdf',
        description: 'First document',
        user: user,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the findOne method of the repository
      jest.spyOn(repo, 'findOne').mockResolvedValue(document);

      const result = await service.getDocumentById(1);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(document);
    });
  });

  describe('updateDocument', () => {
    it('should update the document and return the updated document', async () => {
      const updateDocDto: UpdateDocumentDto = {
        filename: 'updated.pdf',
        path: 'uploads/updated.pdf',
        description: 'Updated document',
      };

      const user = new User();
      user.id = 1;
      user.username = 'testuser';

      const updatedDocument = {
        id: 1,
        filename: updateDocDto.filename,
        path: updateDocDto.path,
        description: updateDocDto.description,
        user: user,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the update method of the repository
      jest.spyOn(repo, 'update').mockResolvedValue(undefined);
      jest.spyOn(repo, 'findOne').mockResolvedValue(updatedDocument);

      const result = await service.updateDocument(1, updateDocDto);

      expect(repo.update).toHaveBeenCalledWith(1, updateDocDto);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(updatedDocument);
    });
  });

  describe('deleteDocument', () => {
    it('should delete the document by id', async () => {
      // Mock the delete method of the repository
      jest.spyOn(repo, 'delete').mockResolvedValue(undefined);

      await service.deleteDocument(1);

      expect(repo.delete).toHaveBeenCalledWith(1);
    });
  });
});
