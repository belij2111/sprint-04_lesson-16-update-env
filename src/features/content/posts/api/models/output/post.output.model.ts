import { SortQueryFilterType } from '../../../../../../base/pagination.base.model';
import { SearchNameTermFilterType } from '../../../../../../base/pagination.base.model';

export class PostOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'None';
    newestLikes: {
      addedAt: Date;
      userId: string;
      login: string;
    }[];
  };
}

export interface QueryPostFilterType
  extends SortQueryFilterType,
    SearchNameTermFilterType {}
