import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
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

    return 'This action adds a new auth';
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Please check server logs')
  }
}
