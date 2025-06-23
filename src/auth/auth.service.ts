import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name); // Initialize a logger for the service


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, // Inject the JWT service for token generation
  ) { }

  async create(createAuthDto: CreateUserDto) {
    try {
      const { password, ...userData } = createAuthDto; // Destructure the DTO to get password and user details

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10), // Hash the password before saving
      });

      await this.userRepository.save(user); // Save the user instance to the database

      const { password: _, ...userToReturn } = user;

      return { ...userToReturn, token: this.getJwtToken({ id: userToReturn.id }) } // Return the user without the password
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto; // Destructure the DTO to get password and email

    const user = await this.userRepository.findOne({
      where: { email }, // Find the user by email
      select: { password: true, id: true, fullname: true, email: true, roles: true } // Select only the necessary fields
    }); // Find the user by email

    if (!user) throw new UnauthorizedException('Credentials are not valid'); // If user not found, throw an error

    if (!bcrypt.compareSync(password, user.password)) { // Compare the hashed password with the provided password
      throw new UnauthorizedException('Credentials are not valid');
    }

    const { password: _, ...userData } = user; // Destructure the user to remove the password

    return { ...userData, token: this.getJwtToken({ id: user.id }) }; // Return the user if credentials are valid


  }

  async checkAuthStatus(user: User) {
    const { password: _, ...userData } = user; // Destructure the user to remove the password
    return { ...userData, token: this.getJwtToken({ id: user.id }) }; // Return the user data and a new token
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload); // Sign the payload to create a JWT token
    return token; // Return the token
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Please check server logs')
  }
}
