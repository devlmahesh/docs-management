import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { Document } from './document/entities/document.entity';
import { Ingestion } from './ingestion/entities/ingestion.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'password12345',
      database: 'document_backend',
      entities: [User, Document, Ingestion],
      synchronize: true,
    }),
    UserModule,
    DocumentModule,
    IngestionModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
