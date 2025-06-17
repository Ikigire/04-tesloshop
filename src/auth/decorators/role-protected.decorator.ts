import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.enum';

export const META_ROLES_KEY = 'roles'

export const RoleProtected = (...args: ValidRoles[]) => {
    
    return SetMetadata(META_ROLES_KEY, args);
}
