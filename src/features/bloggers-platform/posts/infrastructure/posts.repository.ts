import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { PostCreateModel } from '../api/models/input/create-post.input.model';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
  ) {}

  async create(newPost: Post): Promise<{ id: string }> {
    const result = await this.PostModel.create(newPost);
    return { id: result._id.toString() };
  }

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

  async update(
    foundPost: PostDocument,
    postUpdateModel: PostCreateModel,
  ): Promise<boolean | null> {
    const result = await this.PostModel.updateOne(
      { _id: foundPost.id },
      { $set: postUpdateModel },
    );
    return result.modifiedCount !== 0;
  }
}
