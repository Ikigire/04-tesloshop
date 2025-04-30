import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

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
    return true;
  }
}
