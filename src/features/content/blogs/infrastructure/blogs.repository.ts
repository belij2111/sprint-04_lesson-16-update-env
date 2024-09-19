import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async delete(id: string): Promise<boolean> {
    const deletionResult = await this.BlogModel.deleteOne({ _id: id });
    return deletionResult.deletedCount === 1;
  }
}
