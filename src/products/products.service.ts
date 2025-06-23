import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { log } from 'console';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name); // Initialize a logger for the service

  constructor(
    @InjectRepository(Product) // Inject the Product repository
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage) // Inject the Product repository
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource, // Inject the DataSource for database operations
  ) { }

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const {images = [], ...productDetails} = createProductDto; // Destructure the DTO to get images and product details}

      const product = this.productRepository.create({
        ...productDetails, 
        images: images.map( img => this.productImageRepository.create({ url: img })), // Create a new product instance with images
        user // Associate the product with the user who created it

      }); // Create a new product instance into the database
      await this.productRepository.save(product); // Save the product instance to the database

      return {...product, images}; // Return the created product instance
    } catch (error) {
      this.handleDBErrors(error); // Handle any database errors that occur during the creation process
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto; // Destructure the pagination DTO to get limit and offset values

    const products = await this.productRepository.find({
      take: limit, // Limit the number of results returned
      skip: offset, // Skip the specified number of results
      relations: {
        images: true, // Include related images in the results
      }
    }); // Find all products in the database with pagination

    return products.map(({images, ...productDetails}) => ({
      ...productDetails,
      images: images!.map(image => image.url) // Map the images to their URLs
    })); // Return the products with their images
  }

  async findOne(searchTerm: string) {
    let product: Product | null = null; // Initialize product variable

    product = await this.productRepository.findOneBy(this.getSearchObject(searchTerm)); // Find 

    if (!product) // If no product is found, throw an error
      throw new NotFoundException(`Product with id or slug "${searchTerm}" not found`);

    return product; // Return the found product
  }

  async findOnePlain(searchTerm: string) {
    let {images = [], ...product} = await this.findOne(searchTerm); // Find a product by its UUID or slug
    return {
      ...product,
      images: images.map(image => image.url) // Map the images to their URLsq
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto; // Destructure the DTO to get images and product details
    
    const product = await this.productRepository.preload({ id, ...toUpdate}); // Preload the product with the updated data
    
    if (!product) // If no product is found, throw an error
    throw new NotFoundException(`Product with id "${id}" not found`);
    
    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner(); // Create a new query runner
    try {
      await queryRunner.connect(); // Connect the query runner to the database
      await queryRunner.startTransaction(); // Start a new transaction


      if (images) { // If images are provided, handle them
        await queryRunner.manager.delete(ProductImage, { product: { id } }); // Delete existing images for the product

        product.images = images.map(image => this.productImageRepository.create({ url: image })); // Create new images for the product
      }

      product.user = user; // Associate the product with the user who updated it
      await queryRunner.manager.save(product); // Save the new images to the database
      
      await queryRunner.commitTransaction(); // Commit the transaction
      await queryRunner.release(); // Release the query runner
      // await this.productRepository.save(product); // Save the updated product to the database
      return this.findOnePlain(id); // Return the updated product

    } catch (error) {
      await queryRunner.rollbackTransaction(); // Rollback the transaction in case of an error
      await queryRunner.release(); // Release the query runner
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

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product'); // Create a query builder for the product repository
    try {
      return await query
        .delete() // Delete all products from the database
        .where({}) // No conditions, delete all products
        .execute(); // Execute the delete operation
    } catch (error) {
      this.handleDBErrors(error); // Handle any database errors that occur during the deletion process
    }
  }
}
