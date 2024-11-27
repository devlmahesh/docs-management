import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { Ingestion } from './entities/ingestion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Ingestion]), HttpModule],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
