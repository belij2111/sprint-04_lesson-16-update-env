import { SortQueryFilterType } from '../../../../../base/pagination.base.model';
import { SearchLoginTermFilterType } from '../../../../../base/pagination.base.model';
import { SearchEmailTermFilterType } from '../../../../../base/pagination.base.model';

export class UserOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export interface QueryUserFilterType
  extends SortQueryFilterType,
    SearchLoginTermFilterType,
    SearchEmailTermFilterType {}
