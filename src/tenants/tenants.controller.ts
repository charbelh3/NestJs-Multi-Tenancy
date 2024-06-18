import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import CreateCompanyDto from './create-company.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post('create-company')
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.tenantsService.createCompany(createCompanyDto);
  }
}
