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

  static mapToView(post: PostDocument, currentStatus: string): PostViewModel {
    const model = new PostViewModel();
    const newestLikes = post.extendedLikesInfo.newestLikes.map((el) => ({
      addedAt: el.addedAt,
      userId: el.userId,
      login: el.login,
    }));
    model.id = post._id.toString();
    model.title = post.title;
    model.shortDescription = post.shortDescription;
    model.content = post.content;
    model.blogId = post.blogId;
    model.blogName = post.blogName;
    model.createdAt = post.createdAt;
    model.extendedLikesInfo = {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: currentStatus,
      newestLikes: newestLikes,
    };

    return model;
  }
}
