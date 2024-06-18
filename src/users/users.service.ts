import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import UserDto from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async getUserByEmail(email: string) {
    return this.UserModel.findOne({ email });
  }

  async createUser(user: UserDto, tenantId: string) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.UserModel.create({ ...user, tenantId });
  }
}
