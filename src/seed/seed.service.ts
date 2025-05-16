import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService, // Inject the ProductsService to access product-related methods
  ) {}
  
  async runSeed() {
    this.productsService.deleteAllProducts(); // Call the method to delete all products
    await this.insertNewProducts(); // Call the method to insert new products
    return 'SEED EXECUTED!';
  }

  private async insertNewProducts() {
    const products = initialData.products; // Get the initial data for products
    const insertPromises = products.map(product => this.productsService.create(product)); // Map each product to a create promise
    await Promise.all(insertPromises); // Wait for all promises to resolve


    return true;
  }
}
