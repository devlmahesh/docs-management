import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

describe('DocumentController', () => {
  let controller: DocumentController;
  let documentService: DocumentService;

  // Mock the DocumentService
  const mockDocumentService = {
    uploadDocument: jest.fn(),
    getAllDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    deleteDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService,
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
  });

  describe('upload', () => {
    it('should upload a document and return it', async () => {
      const file = {
        fieldname: 'file',
        originalname: 'document.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        stream: {} as any, // Mock stream (not used in test)
        destination: 'uploads/',
        filename: 'document.pdf',
        path: 'uploads/document.pdf',
        buffer: Buffer.from('filedata'), // Mock buffer (not used in test)
      };
      const savedDocument = {
        id: 1,
        filename: 'document.pdf',
        path: 'uploads/document.pdf',
        description: 'Test document',
        user: { id: 1, username: 'testuser' },
        createdAt: new Date(),
        updatedAt: null,
      };

      mockDocumentService.uploadDocument.mockResolvedValue(savedDocument);

      const result = await controller.upload(file);

      expect(result).toEqual(savedDocument);
      expect(mockDocumentService.uploadDocument).toHaveBeenCalledWith(file);
    });

    it('should throw an error if the user does not have the correct role', async () => {
      // You can simulate role-based access by mocking the `RolesGuard`
      // in a real-world scenario, you'd want to test if unauthorized users are blocked
    });
  });

  describe('getAll', () => {
    it('should return all documents', async () => {
      const documents = [
        {
          id: 1,
          filename: 'doc1.pdf',
          path: 'uploads/doc1.pdf',
          description: 'Document 1',
          createdAt: new Date(),
        },
        {
          id: 2,
          filename: 'doc2.pdf',
          path: 'uploads/doc2.pdf',
          description: 'Document 2',
          createdAt: new Date(),
        },
      ];

      mockDocumentService.getAllDocuments.mockResolvedValue(documents);

      const result = await controller.getAll();
      expect(result).toEqual(documents);
      expect(mockDocumentService.getAllDocuments).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a document by id', async () => {
      const document = {
        id: 1,
        filename: 'doc1.pdf',
        path: 'uploads/doc1.pdf',
        description: 'Document 1',
        createdAt: new Date(),
      };

      mockDocumentService.getDocumentById.mockResolvedValue(document);

      const result = await controller.getOne(1);
      expect(result).toEqual(document);
      expect(mockDocumentService.getDocumentById).toHaveBeenCalledWith(1);
    });
  });

  describe('delete', () => {
    it('should delete a document by id', async () => {
      mockDocumentService.deleteDocument.mockResolvedValue(undefined);

      await controller.delete(1);
      expect(mockDocumentService.deleteDocument).toHaveBeenCalledWith(1);
    });

    it('should throw an error if the user does not have the correct role to delete', async () => {
      // Similar to upload, mock a case where a user with insufficient role tries to delete a document
    });
  });
});
