import { SORT_TYPE } from '../enums/sort-type.enum';

export interface SortListItemViewModel {
  readonly label: string;
  readonly type: SORT_TYPE;
  readonly isSelected: boolean;
}
