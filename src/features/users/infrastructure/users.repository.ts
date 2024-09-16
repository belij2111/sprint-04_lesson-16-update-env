import { Injectable } from '@nestjs/common';
import { User, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async delete(id: string): Promise<boolean> {
    const deletionResult = await this.UserModel.deleteOne({ _id: id });
    return deletionResult.deletedCount === 1;
  }
}
