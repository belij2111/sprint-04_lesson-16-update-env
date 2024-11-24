import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { BlogCreateModel } from '../api/models/input/create-blog.input.model';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async create(newBlog: Blog): Promise<{ id: string }> {
    const result = await this.BlogModel.create(newBlog);
    return { id: result._id.toString() };
  }

  async update(
    foundBlog: BlogDocument,
    blogUpdatedModel: BlogCreateModel,
  ): Promise<boolean | null> {
    const result = await this.BlogModel.updateOne(
      { _id: foundBlog.id },
      { $set: blogUpdatedModel },
    );
    return result.modifiedCount !== 0;
  }

  async delete(id: string): Promise<boolean> {
    const deletionResult = await this.BlogModel.deleteOne({ _id: id });
    return deletionResult.deletedCount === 1;
  }

  async findById(id: string): Promise<BlogDocument | null> {
    return this.BlogModel.findOne({ _id: id });
  }

  async findByIdOrNotFoundFail(id: string): Promise<BlogDocument> {
    const foundBlog = await this.findById(id);
    if (!foundBlog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return foundBlog;
  }

  async blogIdIsExist(blogId: string): Promise<boolean> {
    return !!(await this.BlogModel.countDocuments({ _id: blogId }));
  }
}
