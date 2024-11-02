import { SortQueryFilterType } from '../../../../../../core/models/pagination.base.model';
import { SearchNameTermFilterType } from '../../../../../../core/models/pagination.base.model';

export class BlogViewModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
}

export interface QueryBlogFilterType
  extends SortQueryFilterType,
    SearchNameTermFilterType {}
