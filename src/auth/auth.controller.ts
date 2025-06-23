import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { META_ROLES_KEY, RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles.enum';
import { Auth } from './decorators/auth.decorator';
;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testPrivate(
    @GetUser() user: User,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      message: "Hello Madafaka"
    };
  }


  @Get('private-roles')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards( AuthGuard(), UserRoleGuard )
  testPrivate2(
    @GetUser() user: User,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      message: "Hello Madafaka"
    };
  }
  
  @Get('private-roles2')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  testPrivate3(
    @GetUser() user: User,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      message: "Hello Madafaka"
    };
  }
}
