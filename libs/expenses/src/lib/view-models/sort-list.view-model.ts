import { SORT_DIRECTION } from '../enums/sort-direction.enum';

export interface SortListViewModel {
  readonly items: string[];
  readonly selectedItem: string;
  readonly selectedDirection: SORT_DIRECTION;
}
