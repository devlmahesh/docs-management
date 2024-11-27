import { Controller, Post, Body, Get } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  trigger(@Body() data: any) {
    return this.ingestionService.triggerIngestion('', data);
  }

  @Get('status')
  status() {
    return this.ingestionService.trackIngestionStatus('url');
  }
}
