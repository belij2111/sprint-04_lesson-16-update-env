import { Injectable } from '@nestjs/common';
import { User, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { LoginInputModel } from '../../auth/api/models/input/login.input.model';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async create(newUser: User): Promise<{ id: string }> {
    const result = await this.UserModel.create(newUser);
    return { id: result._id.toString() };
  }

  async delete(id: string): Promise<boolean> {
    const deletionResult = await this.UserModel.deleteOne({ _id: id });
    return deletionResult.deletedCount === 1;
  }

  async findOne(loginOrEmail: LoginInputModel) {
    return this.UserModel.findOne({ login: loginOrEmail });
  }
}
