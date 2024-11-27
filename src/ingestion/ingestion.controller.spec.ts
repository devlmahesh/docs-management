import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

// Mocked responses for testing
const mockTriggerResponse = {
  success: true,
  message: 'Ingestion triggered successfully',
};
const mockStatusResponse = {
  status: 'Completed',
  message: 'Ingestion is completed',
};

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: {
            triggerIngestion: jest.fn(),
            trackIngestionStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  describe('trigger', () => {
    it('should trigger ingestion and return success response', async () => {
      // Mock the service method to return the mock response
      jest
        .spyOn(service, 'triggerIngestion')
        .mockResolvedValue(mockTriggerResponse);

      const data = { field: 'testData' };
      const result = await controller.trigger(data);

      expect(service.triggerIngestion).toHaveBeenCalledWith('', data);
      expect(result).toEqual(mockTriggerResponse);
    });

    it('should handle errors and return an error response', async () => {
      // Mock the service method to throw an error
      const error = new Error('Ingestion failed');
      jest.spyOn(service, 'triggerIngestion').mockRejectedValueOnce(error);

      const data = { field: 'testData' };

      await expect(controller.trigger(data)).rejects.toThrowError(
        'Ingestion failed',
      );
    });
  });

  describe('status', () => {
    it('should return ingestion status', async () => {
      // Mock the service method to return the mock status response
      jest
        .spyOn(service, 'trackIngestionStatus')
        .mockResolvedValue(mockStatusResponse);

      const result = await controller.status();

      expect(service.trackIngestionStatus).toHaveBeenCalledWith('url');
      expect(result).toEqual(mockStatusResponse);
    });

    it('should handle errors and return an error response', async () => {
      // Mock the service method to throw an error
      const error = new Error('Tracking failed');
      jest.spyOn(service, 'trackIngestionStatus').mockRejectedValueOnce(error);

      await expect(controller.status()).rejects.toThrowError('Tracking failed');
    });
  });
});
