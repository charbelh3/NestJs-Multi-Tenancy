import { Global, Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './tenant.schema';
import { tenantConnectionProvider } from 'src/providers/tenant-connection.provider';
import { UsersModule } from 'src/users/users.module';
import { TenantsController } from './tenants.controller';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Tenant.name,
        schema: TenantSchema,
      },
    ]),
  ],
  controllers: [TenantsController],
  providers: [TenantsService, tenantConnectionProvider],
  exports: [TenantsService, tenantConnectionProvider],
})
export class TenantsModule {}
