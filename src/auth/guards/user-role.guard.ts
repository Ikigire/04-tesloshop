import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES_KEY } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const user = request.user as User;

    if (!user) throw new BadRequestException('Cannot find user information');

    const requiredRoles: string[] = this.reflector.get(META_ROLES_KEY, context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required, allow access
    }

    for (const role of user.roles) {
      if ( requiredRoles.includes(role) )
        return true;
    }

    throw new ForbiddenException(`The user ${user.fullname} has no the reuired role to access this endpoint`);
  }
}
