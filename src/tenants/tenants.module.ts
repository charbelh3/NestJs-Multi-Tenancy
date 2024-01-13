import { Global, Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './tenant.schema';
import { tenantConnectionProvider } from 'src/providers/tenant-connection.provider';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tenant.name,
        schema: TenantSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [TenantsService, tenantConnectionProvider],
  exports: [TenantsService, tenantConnectionProvider],
})
export class TenantsModule {}
