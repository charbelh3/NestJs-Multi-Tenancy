import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { TenantConnectionService } from 'src/services/tenant-connection.service';
import { encrypt } from 'src/utils/encrypt';
import { Secrets, SecretsSchema } from './secrets.schema';
import CredentialsDto from './dtos/credentials.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { decrypt } from 'src/utils/decrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private tenantConnectionService: TenantConnectionService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(credentials: CredentialsDto) {
    //Find if user exists by email
    const { email, password } = credentials;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    //Compare entered password with existing password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
    //Fetch tenant specific secret key
    const secretKey = await this.fetchAccessTokenSecretSigningKey(
      user.tenantId,
    );
    //Generate JWT access token
    const accessToken = await this.jwtService.sign(
      { userId: user._id },
      { secret: secretKey, expiresIn: '10h' },
    );

    return { accessToken, tenantId: user.tenantId };
  }

  async createSecretKeyForNewTenant(tenantId: string) {
    //Generate Random Secret Key
    const jwtSecret = nanoid(128);

    //Encrypt the Secret Key
    const encryptedSecret = encrypt(
      jwtSecret,
      this.configService.get(`security.encryptionSecretKey`),
    );

    //Get Access to the tenant specific Model
    const SecretsModel = await this.tenantConnectionService.getTenantModel(
      {
        name: Secrets.name,
        schema: SecretsSchema,
      },
      tenantId,
    );

    //Store the encrypted secret key
    await SecretsModel.create({ jwtSecret: encryptedSecret });
  }

  async fetchAccessTokenSecretSigningKey(tenantId: string) {
    const SecretsModel = await this.tenantConnectionService.getTenantModel(
      {
        name: Secrets.name,
        schema: SecretsSchema,
      },
      tenantId,
    );

    const secretsDoc = await SecretsModel.findOne();
    const secretKey = decrypt(
      secretsDoc.jwtSecret,
      this.configService.get(`security.encryptionSecretKey`),
    );
    return secretKey;
  }
}
