import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantsService } from 'src/tenants/tenants.service';

@Injectable()
export class TenantsMiddleware implements NestMiddleware {
  constructor(private tenantsService: TenantsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //Check that tenantId exists in the headers of the request
    const tenantId = req.headers['x-tenant-id']?.toString();
    if (!tenantId) {
      throw new BadRequestException('X-TENANT-ID not provided');
    }

    const tenantExits = await this.tenantsService.getTenantById(tenantId);
    if (!tenantExits) {
      throw new NotFoundException('Tenant does not exist');
    }
    //Set the tenantId on the request object for later access
    req['tenantId'] = tenantId;
    next();
  }
}
