import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async delete(id: string): Promise<boolean> {
    const deletionResult = await this.PostModel.deleteOne({ _id: id });
    return deletionResult.deletedCount === 1;
  }

  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findOne({ _id: id });
  }

  async findByIdOrNotFoundFail(id: string): Promise<PostDocument> {
    const foundPost = await this.findById(id);
    if (!foundPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return foundPost;
  }
}
