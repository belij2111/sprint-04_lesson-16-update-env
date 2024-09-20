import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../users/domain/user.entity';
import { Blog, BlogModelType } from '../../content/blogs/domain/blog.entity';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
  ) {}

  async deleteAllData() {
    await Promise.all([
      this.UserModel.deleteMany(),
      this.BlogModel.deleteMany(),
    ]);
  }
}
