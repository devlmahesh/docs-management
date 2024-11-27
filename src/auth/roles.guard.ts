import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Retrieve the roles set in the route handler
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true; // If no roles are required, grant access

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user has one of the required roles
    return requiredRoles.some((role) => user?.role === role);
  }
}
