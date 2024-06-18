import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tenant } from './tenant.schema';
import { Model } from 'mongoose';
import CreateCompanyDto from './create-company.dto';
import { UsersService } from 'src/users/users.service';
import { nanoid } from 'nanoid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name)
    private TenantModel: Model<Tenant>,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async getTenantById(tenantId: string) {
    return this.TenantModel.findOne({ tenantId });
  }

  async createCompany(companyData: CreateCompanyDto) {
    //Verify user does not already exist
    const user = await this.usersService.getUserByEmail(companyData.user.email);
    if (user) {
      throw new BadRequestException('User exists and belongs to a company...');
    }
    //Create a tenant Id
    const tenantId = nanoid(12);

    //Create a tenant secret
    await this.authService.createSecretKeyForNewTenant(tenantId);
    
    //Create new user
    await this.usersService.createUser(companyData.user, tenantId);

    //Create Tenant Record
    return this.TenantModel.create({
      companyName: companyData.companyName,
      tenantId,
    });
  }
}
