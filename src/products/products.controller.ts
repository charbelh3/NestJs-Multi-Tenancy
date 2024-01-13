import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Connection } from 'mongoose';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }
}
