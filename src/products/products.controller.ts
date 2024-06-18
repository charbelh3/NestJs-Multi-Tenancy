import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { TenantAuthenticationGuard } from 'src/guards/tenant-auth.guard';

@UseGuards(TenantAuthenticationGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }
}
