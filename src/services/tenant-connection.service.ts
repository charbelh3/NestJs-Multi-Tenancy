import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class TenantConnectionService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  //Return the corresponding tenant database connection
  private getTenantConnection(tenantId: string): Connection {
    const tenantDbName = `tenant_${tenantId}`;
    return this.connection.useDb(tenantDbName);
  }

  async getTenantModel({ name, schema }, tenantId: string) {
    const tenantConnection = this.getTenantConnection(tenantId);
    return tenantConnection.model(name, schema);
  }
}
