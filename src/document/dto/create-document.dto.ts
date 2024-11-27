import { IsString, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  description?: string;
}
