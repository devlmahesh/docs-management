import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { HttpService } from '@nestjs/axios';

// Mocked response for testing
const mockPostResponse = {
  data: { success: true, message: 'Ingestion triggered' },
};
const mockGetResponse = {
  data: { status: 'Completed', message: 'Ingestion successful' },
};

describe('IngestionService', () => {
  let service: IngestionService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              post: jest.fn(),
              get: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('triggerIngestion', () => {
    it('should trigger ingestion and return response data', async () => {
      // Mock the post method to return the mocked response
      jest
        .spyOn(httpService.axiosRef, 'post')
        .mockResolvedValueOnce(mockPostResponse);

      const url = 'https://example.com/ingest';
      const payload = { data: 'sample' };

      const result = await service.triggerIngestion(url, payload);

      expect(httpService.axiosRef.post).toHaveBeenCalledWith(url, payload);
      expect(result).toEqual(mockPostResponse.data);
    });

    it('should throw an error if ingestion fails', async () => {
      const error = new Error('Ingestion failed');
      jest.spyOn(httpService.axiosRef, 'post').mockRejectedValueOnce(error);

      const url = 'https://example.com/ingest';
      const payload = { data: 'sample' };

      await expect(service.triggerIngestion(url, payload)).rejects.toThrowError(
        'Ingestion failed',
      );
    });
  });

  describe('trackIngestionStatus', () => {
    it('should return ingestion status', async () => {
      // Mock the get method to return the mocked response
      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockResolvedValueOnce(mockGetResponse);

      const url = 'https://example.com/ingestion-status';

      const result = await service.trackIngestionStatus(url);

      expect(httpService.axiosRef.get).toHaveBeenCalledWith(url);
      expect(result).toEqual(mockGetResponse.data);
    });

    it('should throw an error if tracking fails', async () => {
      const error = new Error('Tracking failed');
      jest.spyOn(httpService.axiosRef, 'get').mockRejectedValueOnce(error);

      const url = 'https://example.com/ingestion-status';

      await expect(service.trackIngestionStatus(url)).rejects.toThrowError(
        'Tracking failed',
      );
    });
  });
});
