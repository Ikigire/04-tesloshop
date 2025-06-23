import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { use } from 'passport';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService, // Inject the ProductsService to access product-related methods
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Inject the UsersService to access user-related methods
  ) {}
  
  async runSeed() {
    await this.deleteTables(); // Call the method to delete all products

    const adminUser: User = await this.insertNewUsers(); // Call the method to insert new users

    await this.insertNewProducts(adminUser); // Call the method to insert new products
    return 'SEED EXECUTED!';
  }

  private async insertNewUsers(): Promise<User> {
    const seedUsers = initialData.users!; // Get the initial data for users
    const users: User[] = []; // Initialize an array to hold user instances
    seedUsers.forEach(user => {
      user.password = bcrypt.hashSync(user.password, 10); // Hash the password for each user
      users.push(this.userRepository.create(user)); // Create a new user instance for each user in the seed data
    })

    const dbUsers = await this.userRepository.save(users); // Save all user instances to the database
    return dbUsers[1]; // Return the second user as the admin user
  }

  private async insertNewProducts(user: User) {
    const products = initialData.products; // Get the initial data for products
    const insertPromises = products.map(product => this.productsService.create(product, user)); // Map each product to a create promise
    await Promise.all(insertPromises); // Wait for all promises to resolve


    return true;
  }

  private async deleteTables() {
     await this.productsService.deleteAllProducts(); // Call the method to delete all products
     const queryBuilder = this.userRepository.createQueryBuilder();
     await queryBuilder
      .delete()
      .where({})
      .execute(); // Delete all users from the database
  }
     
  }
