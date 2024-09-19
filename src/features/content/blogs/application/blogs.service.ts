import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async delete(id: string): Promise<boolean> {
    return this.blogsRepository.delete(id);
  }
}
