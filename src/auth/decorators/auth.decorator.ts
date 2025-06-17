import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { META_ROLES_KEY, RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { ValidRoles } from "../interfaces/valid-roles.enum";
import { UserRoleGuard } from "../guards/user-role.guard";

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard)
  );
    
}