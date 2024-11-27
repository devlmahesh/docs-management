import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

// Define a decorator that sets metadata for roles
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
