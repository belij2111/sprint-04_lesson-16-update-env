import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async create(newBlog: Blog): Promise<{ id: string }> {
    const result = await this.BlogModel.create(newBlog);
    return { id: result._id.toString() };
  }

  async delete(id: string): Promise<boolean> {
    const deletionResult = await this.BlogModel.deleteOne({ _id: id });
    return deletionResult.deletedCount === 1;
  }
}
