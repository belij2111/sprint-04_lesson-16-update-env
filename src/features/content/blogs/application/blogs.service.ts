import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogCreateModel } from '../api/models/input/create-blog.input.model';
import { Blog } from '../domain/blog.entity';
import { Types } from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async create(blogCreateModel: BlogCreateModel): Promise<{ id: string }> {
    const newBlogDto: Blog = {
      _id: new Types.ObjectId(),
      name: blogCreateModel.name,
      description: blogCreateModel.description,
      websiteUrl: blogCreateModel.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };
    return await this.blogsRepository.create(newBlogDto);
  }

  async delete(id: string): Promise<boolean> {
    return this.blogsRepository.delete(id);
  }
}
