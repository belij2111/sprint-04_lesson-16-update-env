import { PostDocument } from '../../../domain/post.entity';

export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: {
      addedAt: Date;
      userId: string;
      login: string;
    }[];
  };

  static mapToView(post: PostDocument): PostViewModel {
    const model = new PostViewModel();
    model.id = post._id.toString();
    model.title = post.title;
    model.shortDescription = post.shortDescription;
    model.content = post.content;
    model.blogId = post.blogId;
    model.blogName = post.blogName;
    model.extendedLikesInfo = post.extendedLikesInfo;

    return model;
  }
}
