import { SORT_DIRECTION } from '../enums/sort-direction.enum';
import { SORT_TYPE } from '../enums/sort-type.enum';

export interface SortModel {
  readonly sortBy: SORT_TYPE;
  readonly direction: SORT_DIRECTION;
}
