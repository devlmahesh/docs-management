import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class IngestionService {
  constructor(private readonly httpService: HttpService) {}

  async triggerIngestion(url: string, payload: any) {
    // Example usage of HttpService
    const response = await this.httpService.axiosRef.post(url, payload);
    return response.data;
  }

  async trackIngestionStatus(url: string) {
    // Example usage of HttpService
    const response = await this.httpService.axiosRef.get(url);
    return response.data;
  }
}
