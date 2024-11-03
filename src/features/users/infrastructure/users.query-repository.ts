import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/user.entity';
import { UserViewModel } from '../api/models/view/user.view.model';
import { MeViewModel } from '../../auth/api/models/view/me.view.model';
import { GetUsersQueryParams } from '../api/models/input/create-user.input.model';
import { PaginatedViewModel } from '../../../core/models/base.paginated.view.model';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
  ) {}

  async getUsers(
    inputQuery: GetUsersQueryParams,
  ): Promise<PaginatedViewModel<UserViewModel[]>> {
    const filter = {
      $or: [
        { login: { $regex: inputQuery.searchLoginTerm || '', $options: 'i' } },
        { email: { $regex: inputQuery.searchEmailTerm || '', $options: 'i' } },
      ],
    };
    const foundUsers = await this.UserModel.find(filter)
      .sort({ [inputQuery.sortBy]: inputQuery.sortDirection })
      .skip(inputQuery.calculateSkip())
      .limit(inputQuery.pageSize)
      .exec();
    const totalCount = await this.UserModel.countDocuments(filter);
    const items = foundUsers.map(UserViewModel.mapToView);
    return PaginatedViewModel.mapToView({
      pageNumber: inputQuery.pageNumber,
      pageSize: inputQuery.pageSize,
      totalCount,
      items,
    });
  }

  async getById(id: string): Promise<UserViewModel | null> {
    const foundUser = await this.UserModel.findById(id);
    if (!foundUser) return null;
    return UserViewModel.mapToView(foundUser);
  }

  async getAuthUserById(id: string): Promise<MeViewModel | null> {
    const foundUser = await this.UserModel.findById(id);
    if (!foundUser) return null;
    return MeViewModel.mapToView(foundUser);
  }
}
