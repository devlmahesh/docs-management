import { IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../../auth/role.enum';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}
