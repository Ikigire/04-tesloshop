import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { log } from 'console';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name); // Initialize a logger for the service

  constructor(
    @InjectRepository(Product) // Inject the Product repository
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.productRepository.create(createProductDto); // Create a new product instance into the database
      await this.productRepository.save(product); // Save the product instance to the database

      return product; // Return the created product instance
    } catch (error) {
      this.handleDBErrors(error); // Handle any database errors that occur during the creation process
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto; // Destructure the pagination DTO to get limit and offset values

    return await this.productRepository.find({
      take: limit, // Limit the number of results returned
      skip: offset, // Skip the specified number of results
    }); // Find all products in the database with pagination
  }

  async findOne(searchTerm: string) {
    let product: Product | null = null; // Initialize product variable

    product = await this.productRepository.findOneBy(this.getSearchObject(searchTerm)); // Find 

    if (!product) // If no product is found, throw an error
      throw new NotFoundException(`Product with id or slug "${searchTerm}" not found`);

    return product; // Return the found product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({ id, ...updateProductDto }); // Preload the product with the updated data

      if (!product) // If no product is found, throw an error
        throw new NotFoundException(`Product with id "${id}" not found`);

      await this.productRepository.save(product); // Save the updated product to the database
      return product; // Return the updated product
    } catch (error) {
      this.handleDBErrors(error); // Handle any database errors that occur during the update process
    }
  }

  async remove(id: string) {
    const { affected } = await this.productRepository.delete({ id }); // Delete a product by its UUID

    if (!affected || affected === 0) // If no product is deleted, throw an error
      throw new NotFoundException(`Product with id "${id}" not found`);

    return { id, deleted: true }; // Return the deleted product information
  }

  private getSearchObject(searchTerm: string) {
    if (isUUID(searchTerm))
      return { id: searchTerm }; // Find a product by its UUID
    else
      return { slug: searchTerm }; // Find a product by its slug
  }

  private handleDBErrors(error: any) {
    // Handle error
    this.logger.error(error);
    

    switch (error.code) {
      case '23505': // Unique constraint violation error code for PostgreSQL
        throw new BadRequestException(error.detail);
        break;

      case '23503': // Foreign key violation error code for PostgreSQL
        break;

      default:
        throw new InternalServerErrorException('Please check server logs');
    }
  }
}
