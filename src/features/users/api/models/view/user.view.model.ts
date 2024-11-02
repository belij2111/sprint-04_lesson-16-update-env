import { SortQueryFilterType } from '../../../../../core/models/pagination.base.model';
import { SearchLoginTermFilterType } from '../../../../../core/models/pagination.base.model';
import { SearchEmailTermFilterType } from '../../../../../core/models/pagination.base.model';

export class UserViewModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export interface QueryUserFilterType
  extends SortQueryFilterType,
    SearchLoginTermFilterType,
    SearchEmailTermFilterType {}
