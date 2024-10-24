import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import {
  QueryUserFilterType,
  UserOutputModel,
} from '../api/models/output/user.output.model';
import { Paginator } from '../../../base/pagination.base.model';
import { MeViewModel } from '../../auth/api/models/output/me.view.model';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
  ) {}

  async getUsers(
    inputQuery: QueryUserFilterType,
  ): Promise<Paginator<UserOutputModel[]>> {
    const filter = {
      $or: [
        {
          login: {
            $regex: inputQuery.searchLoginTerm,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: inputQuery.searchEmailTerm,
            $options: 'i',
          },
        },
      ],
    };
    const items = await this.UserModel.find(filter)
      .sort({ [inputQuery.sortBy]: inputQuery.sortDirection })
      .skip((inputQuery.pageNumber - 1) * inputQuery.pageSize)
      .limit(inputQuery.pageSize)
      .lean()
      .exec();
    const totalCount = await this.UserModel.countDocuments(filter);
    return {
      pagesCount: Math.ceil(totalCount / inputQuery.pageSize),
      page: inputQuery.pageNumber,
      pageSize: inputQuery.pageSize,
      totalCount,
      items: items.map(this.userMapToOutput),
    };
  }

  async getById(id: string): Promise<UserOutputModel | null> {
    const foundUser = await this.UserModel.findById(id);
    if (!foundUser) return null;
    return this.userMapToOutput(foundUser);
  }

  async getAuthUserById(id: string): Promise<MeViewModel | null> {
    const foundUser = await this.UserModel.findById(id);
    if (!foundUser) return null;
    return this.authUserMapToOutput(foundUser);
  }

  private userMapToOutput(user: UserDocument): UserOutputModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private authUserMapToOutput(user: UserDocument): MeViewModel {
    return {
      email: user.email,
      login: user.login,
      userId: user._id.toString(),
    };
  }
}
