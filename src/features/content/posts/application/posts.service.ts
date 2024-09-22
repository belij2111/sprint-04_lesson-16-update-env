import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostsRepository) {}
  async delete(id: string): Promise<boolean> {
    const foundPost = await this.postRepository.findByIdOrNotFoundFail(id);
    return this.postRepository.delete(foundPost.id);
  }
}
