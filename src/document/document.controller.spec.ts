import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { UserService } from '../user/user.service';
import { BadGatewayException } from '@nestjs/common';

describe('DocumentController', () => {
  let documentController: DocumentController;
  let documentService: DocumentService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: {
            uploadDocument: jest.fn(),
            getAllDocuments: jest.fn(),
            getDocumentById: jest.fn(),
            deleteDocument: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    documentController = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(documentController).toBeDefined();
    expect(documentService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('uploadDocument', () => {
    it('should throw BadGatewayException if no file is uploaded', async () => {
      await expect(
        documentController.uploadDocument(null, { id: 1 }),
      ).rejects.toThrow(BadGatewayException);
    });
  });
});
