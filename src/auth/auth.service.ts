import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name); // Initialize a logger for the service


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createAuthDto: CreateUserDto) {
    try {
      const { password, ...userData } = createAuthDto; // Destructure the DTO to get password and user details

      const user = await this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10), // Hash the password before saving
      });

       const { password:_ , ...UserToReturn } = user;
      
      return UserToReturn // Return the user without the password
    } catch (error) {
      console.log(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto; // Destructure the DTO to get password and email

      const user = await this.userRepository.findOne({
        where: { email }, // Find the user by email
        select: { password: true, id: true, fullname: true, email: true } // Select only the necessary fields
      }); // Find the user by email

      if (!user) throw new UnauthorizedException('Credentials are not valid'); // If user not found, throw an error

      if (!bcrypt.compareSync(password, user.password)) { // Compare the hashed password with the provided password
        throw new UnauthorizedException('Credentials are not valid');
      }

      return user; // Return the user if credentials are valid
    } catch (error) {
      this.handleError(error); // Handle any errors that occur
    }

  }

  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Please check server logs')
  }
}
