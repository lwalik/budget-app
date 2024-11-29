import { Inject, Injectable } from '@angular/core';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import {
  compareDatesWithoutTime,
  DashboardFiltersState,
  DashboardFiltersStateModel,
  getDayWithMonthAsString,
  isAfterDate,
  isBeforeDate,
  TransactionSummaryViewModel,
  WALLET_BALANCE,
  WalletBalance,
} from '@budget-app/shared';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { EXPENSE_PRODUCT_PRIORITY } from '../enums/expense-product-priority.enum';
import { SORT_DIRECTION } from '../enums/sort-direction.enum';
import { SORT_TYPE } from '../enums/sort-type.enum';
import { ExpenseProductModel } from '../models/expense-product.model';
import { ExpenseModel } from '../models/expense.model';
import { ExpensesStateModel } from '../models/expenses-state.model';
import { ProductReportConfigurationStateModel } from '../models/product-report-configuration-state.model';
import { SortModel } from '../models/sort.model';
import { ExpensesService } from '../services/expenses.service';
import { CategoriesReportStepItemViewModel } from '../view-models/categories-report-step-item.view-model';
import { CategorySummaryViewModel } from '../view-models/category-summary.view-model';
import { ExpensesDataViewModel } from '../view-models/expenses-data.view-model';
import { HighestExpensesCategoryViewModel } from '../view-models/highest-expenses-category.view-model';
import { HighestExpenseProductViewModel } from '../view-models/highest-expenses-product.view-model';
import { PrioritySummaryViewModel } from '../view-models/priority-summary.view-model';
import { ProductReportStepItemViewModel } from '../view-models/product-report-step-item.view-model';
import { SortListViewModel } from '../view-models/sort-list.view-model';
import { WalletsReportStepItemViewModel } from '../view-models/wallets-report-step-item.view-model';
import { ReportPreviewViewModel } from '../view-models/report-preview.view-model';

const initialState: ExpensesStateModel = {
  expenses: [],
  reportConfiguration: {
    walletsIds: [],
    products: [],
    categories: [],
    dates: {
      fromDate: undefined,
      toDate: undefined,
    },
  },
};

@Injectable({ providedIn: 'root' })
export class ExpensesState {
  private readonly _expensesStateSubject: BehaviorSubject<ExpensesStateModel> =
    new BehaviorSubject<ExpensesStateModel>(initialState);
  private readonly _expensesState$: Observable<ExpensesStateModel> =
    this._expensesStateSubject.asObservable();

  // TODO move this to expensesState
  private readonly _sortStateSubject: BehaviorSubject<SortModel> =
    new BehaviorSubject<SortModel>({
      sortBy: SORT_TYPE.CREATED_AT,
      direction: SORT_DIRECTION.DESC,
    });
  private readonly _sortState$: Observable<SortModel> =
    this._sortStateSubject.asObservable();

  constructor(
    private readonly _expensesService: ExpensesService,
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext,
    @Inject(WALLET_BALANCE)
    private readonly _walletBalance: WalletBalance,
    private readonly _dashboardFiltersState: DashboardFiltersState
  ) {}

  loadExpenses(): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._expensesState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ExpensesStateModel]) =>
        this._expensesService.getAll(userId).pipe(
          tap((expenses: ExpenseModel[]) =>
            this._expensesStateSubject.next({
              ...state,
              expenses,
            })
          ),
          map(() => void 0)
        )
      )
    );
  }

  getExpenses(): Observable<ExpenseModel[]> {
    return combineLatest([this._expensesState$, this._sortState$]).pipe(
      map(([state, sort]: [ExpensesStateModel, SortModel]) =>
        this._sortExpenses(sort, state.expenses)
      )
    );
  }

  addExpense(
    expense: Omit<ExpenseModel, 'id' | 'ownerId' | 'expenseId'>
  ): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._expensesState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ExpensesStateModel]) =>
        this._expensesService.add(expense, userId).pipe(
          tap((newExpense: ExpenseModel) =>
            this._expensesStateSubject.next({
              ...state,
              expenses: [...state.expenses, newExpense],
            })
          )
        )
      ),
      switchMap(() =>
        this._walletBalance.decreaseWalletBalance(
          expense.walletId,
          expense.totalPrice
        )
      ),
      map(() => void 0)
    );
  }

  updateExpense(updatedExpense: ExpenseModel): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._expensesState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ExpensesStateModel]) =>
        this._expensesService.update(updatedExpense, userId).pipe(
          take(1),
          switchMap(() =>
            this._updateWalletBalance(state.expenses, updatedExpense)
          ),
          tap(() =>
            this._expensesStateSubject.next({
              ...state,
              expenses: state.expenses.map((expense: ExpenseModel) =>
                expense.expenseId === updatedExpense.expenseId
                  ? updatedExpense
                  : expense
              ),
            })
          )
        )
      )
    );
  }

  deleteExpense(expenseId: string): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._expensesState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ExpensesStateModel]) =>
        this._expensesService.delete(expenseId, userId).pipe(
          tap(() =>
            this._expensesStateSubject.next({
              ...state,
              expenses: state.expenses.filter(
                (expense: ExpenseModel) => expense.expenseId !== expenseId
              ),
            })
          )
        )
      )
    );
  }

  deleteAllWalletExpenses(walletId: string): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._expensesState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ExpensesStateModel]) =>
        this._expensesService.deleteAllByWalletId(userId, walletId).pipe(
          tap(() =>
            this._expensesStateSubject.next({
              ...state,
              expenses: state.expenses.filter(
                (expense: ExpenseModel) => expense.walletId !== walletId
              ),
            })
          )
        )
      )
    );
  }

  revertWalletBalance(expense: ExpenseModel): Observable<void> {
    return this._walletBalance.increaseWalletBalance(
      expense.walletId,
      expense.totalPrice
    );
  }

  getSortList(): Observable<SortListViewModel> {
    return this._sortState$.pipe(
      map((sort: SortModel) => ({
        items: Object.values(SORT_TYPE),
        selectedItem: sort.sortBy,
        selectedDirection: sort.direction,
      }))
    );
  }

  updateSortBy(sortBy: SORT_TYPE): Observable<void> {
    return this._sortState$.pipe(
      take(1),
      tap((state: SortModel) =>
        this._sortStateSubject.next({
          ...state,
          sortBy,
        })
      ),
      map(() => void 0)
    );
  }

  updateSortDirection(): Observable<void> {
    return this._sortState$.pipe(
      take(1),
      tap((state: SortModel) =>
        this._sortStateSubject.next({
          ...state,
          direction:
            state.direction === SORT_DIRECTION.ASC
              ? SORT_DIRECTION.DESC
              : SORT_DIRECTION.ASC,
        })
      ),
      map(() => void 0)
    );
  }

  getExpenseSummary(): Observable<TransactionSummaryViewModel> {
    return combineLatest([
      this._expensesState$,
      this._dashboardFiltersState.getFilters(),
    ]).pipe(
      map(
        ([state, filters]: [
          ExpensesStateModel,
          DashboardFiltersStateModel
        ]) => {
          const dateDiff: number =
            filters.toDate.getTime() - filters.fromDate.getTime();
          const prevFromDate: Date = new Date(
            filters.fromDate.getTime() - dateDiff
          );
          const prevToDate: Date = new Date(
            filters.fromDate.getTime() - 24 * 60 * 60 * 1000
          );

          const { total, prevTotal } = state.expenses.reduce(
            (
              acc: { total: number; prevTotal: number },
              expense: ExpenseModel
            ) => {
              if (
                !compareDatesWithoutTime(
                  expense.createdAt,
                  filters.fromDate,
                  isBeforeDate
                ) &&
                !compareDatesWithoutTime(
                  expense.createdAt,
                  filters.toDate,
                  isAfterDate
                ) &&
                (!filters.wallet.id || expense.walletId === filters.wallet.id)
              ) {
                acc.total += expense.totalPrice;
              }

              if (
                !compareDatesWithoutTime(
                  expense.createdAt,
                  prevFromDate,
                  isBeforeDate
                ) &&
                !compareDatesWithoutTime(
                  expense.createdAt,
                  prevToDate,
                  isAfterDate
                ) &&
                (!filters.wallet.id || expense.walletId === filters.wallet.id)
              ) {
                acc.prevTotal += expense.totalPrice;
              }

              return acc;
            },
            { total: 0, prevTotal: 0 }
          );

          return {
            total,
            currency: 'PLN',
            diffSinceLastRange: total - prevTotal,
            diffDaysCount: Math.round(dateDiff / (1000 * 60 * 60 * 24)),
          };
        }
      )
    );
  }

  getExpensesData(): Observable<ExpensesDataViewModel> {
    return combineLatest([
      this._expensesState$,
      this._dashboardFiltersState.getFilters(),
      this._dashboardFiltersState.createEmptyDateRangeObject(),
    ]).pipe(
      map(
        ([state, filters, datesObject]: [
          ExpensesStateModel,
          DashboardFiltersStateModel,
          Record<string, number>
        ]) => {
          const monthlyExpensesMap: Record<string, number> =
            state.expenses.reduce(
              (acc: Record<string, number>, expense: ExpenseModel) => {
                if (
                  compareDatesWithoutTime(
                    expense.createdAt,
                    filters.fromDate,
                    isBeforeDate
                  ) ||
                  compareDatesWithoutTime(
                    expense.createdAt,
                    filters.toDate,
                    isAfterDate
                  ) ||
                  (filters.wallet.id && expense.walletId !== filters.wallet.id)
                ) {
                  return acc;
                }

                const dayWithMonth = getDayWithMonthAsString(expense.createdAt);

                if (!acc[dayWithMonth]) {
                  acc[dayWithMonth] = 0;
                }

                acc[dayWithMonth] += expense.totalPrice;

                return acc;
              },
              datesObject
            );

          return {
            expenses: Object.values(monthlyExpensesMap),
            dates: Object.keys(monthlyExpensesMap),
          };
        }
      )
    );
  }

  getPriorityExpensesSummary(
    priority: EXPENSE_PRODUCT_PRIORITY
  ): Observable<PrioritySummaryViewModel | null> {
    return this._expensesState$.pipe(
      map((state: ExpensesStateModel) => {
        if (state.expenses.length === 0) {
          return null;
        }

        const now: Date = new Date();
        const lastMonth: Date = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        const twoMonthsAgo: Date = new Date(
          now.getFullYear(),
          now.getMonth() - 2,
          now.getDate()
        );

        const productsInCurrentMonth: ExpenseProductModel[] =
          this._getExpensesProductsInRange(
            state.expenses,
            now,
            lastMonth
          ).filter((p) => p.priority === priority);

        const productsInLastMonth: ExpenseProductModel[] =
          this._getExpensesProductsInRange(
            state.expenses,
            lastMonth,
            twoMonthsAgo
          ).filter((p) => p.priority === priority);

        const productsTotalPriceMapInCurrentMonth: Record<string, number> =
          productsInCurrentMonth.reduce(
            (acc: Record<string, number>, cur: ExpenseProductModel) => {
              acc[cur.name] = (acc[cur.name] || 0) + cur.price * cur.quantity;

              return acc;
            },
            {}
          );

        const highestExpenseProduct: HighestExpenseProductViewModel =
          Object.entries(productsTotalPriceMapInCurrentMonth).reduce(
            (acc, [name, price]) => (acc.price < price ? { name, price } : acc),
            { name: '', price: 0 }
          );

        const totalCostInCurrentMonth: number = productsInCurrentMonth.reduce(
          (total: number, cur: ExpenseProductModel) =>
            total + cur.price * cur.quantity,
          0
        );

        const totalCostInLastMonth: number = productsInLastMonth.reduce(
          (total: number, cur: ExpenseProductModel) =>
            total + cur.price * cur.quantity,
          0
        );

        return {
          totalCost: totalCostInCurrentMonth,
          highestExpenseProduct,
          lastMonthDiff: totalCostInLastMonth - totalCostInCurrentMonth,
        };
      })
    );
  }

  getCategoryExpensesSummary(): Observable<CategorySummaryViewModel | null> {
    return this._expensesState$.pipe(
      map((state: ExpensesStateModel) => {
        if (state.expenses.length === 0) {
          return null;
        }

        const now: Date = new Date();
        const lastMonth: Date = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        const twoMonthsAgo: Date = new Date(
          now.getFullYear(),
          now.getMonth() - 2,
          now.getDate()
        );

        const productsInCurrentMonthMap: Record<string, ExpenseProductModel[]> =
          this._getExpensesProductsInRange(
            state.expenses,
            now,
            lastMonth
          ).reduce(
            (
              acc: Record<string, ExpenseProductModel[]>,
              cur: ExpenseProductModel
            ) => {
              if (!acc[cur.category]) {
                acc[cur.category] = [cur];
                return acc;
              }

              acc[cur.category] = [...acc[cur.category], cur];
              return acc;
            },
            {} as Record<string, ExpenseProductModel[]>
          );

        const highestExpenseCategoryInCurrentMonth: HighestExpensesCategoryViewModel =
          Object.entries(productsInCurrentMonthMap).reduce(
            (acc: HighestExpensesCategoryViewModel, [category, products]) => {
              const categoryTotalCost: number = products.reduce(
                (total, cur) => total + cur.price * cur.quantity,
                0
              );

              if (categoryTotalCost > acc.price) {
                return { name: category, price: categoryTotalCost };
              }
              return acc;
            },
            {
              name: '',
              price: 0,
            }
          );

        if (highestExpenseCategoryInCurrentMonth.price === 0) {
          return null;
        }

        const highestExpenseCategoryProductsInCurrentMonthMap: Record<
          string,
          number
        > = (
          productsInCurrentMonthMap[
            highestExpenseCategoryInCurrentMonth.name
          ] || []
        ).reduce((acc: Record<string, number>, cur) => {
          if (!acc[cur.name]) {
            acc[cur.name] = cur.price * cur.quantity;
            return acc;
          }

          acc[cur.name] += cur.price * cur.quantity;
          return acc;
        }, {});

        const highestExpensesProductInCategoryInCurrentMonth: HighestExpenseProductViewModel =
          Object.entries(
            highestExpenseCategoryProductsInCurrentMonthMap
          ).reduce(
            (acc: HighestExpenseProductViewModel, [name, price]) => {
              if (price > acc.price) {
                return { name, price };
              }

              return acc;
            },
            { name: '', price: 0 }
          );

        const productsInLastMonthMap: Record<string, ExpenseProductModel[]> =
          this._getExpensesProductsInRange(
            state.expenses,
            lastMonth,
            twoMonthsAgo
          ).reduce(
            (
              acc: Record<string, ExpenseProductModel[]>,
              cur: ExpenseProductModel
            ) => {
              if (!acc[cur.category]) {
                acc[cur.category] = [cur];
                return acc;
              }

              acc[cur.category] = [...acc[cur.category], cur];
              return acc;
            },
            {} as Record<string, ExpenseProductModel[]>
          );

        const totalCostInLastMonthInHighestExpensesCategory: number =
          productsInLastMonthMap[highestExpenseCategoryInCurrentMonth.name]
            ? productsInLastMonthMap[
                highestExpenseCategoryInCurrentMonth.name
              ].reduce(
                (total: number, cur: ExpenseProductModel) =>
                  total + cur.price * cur.quantity,
                0
              )
            : 0;

        return {
          totalCost: highestExpenseCategoryInCurrentMonth.price,
          name: highestExpenseCategoryInCurrentMonth.name,
          highestExpensesProduct:
            highestExpensesProductInCategoryInCurrentMonth,
          lastMonthDiff:
            totalCostInLastMonthInHighestExpensesCategory -
            highestExpenseCategoryInCurrentMonth.price,
        };
      })
    );
  }

  getAllExpenseWalletsIdsForReportConfiguration(): Observable<
    WalletsReportStepItemViewModel[]
  > {
    return this._expensesState$.pipe(
      map((state: ExpensesStateModel) => {
        const walletsIds: string[] = state.expenses.reduce(
          (total: string[], expense: ExpenseModel) => {
            return [...new Set([...total, expense.walletId])];
          },
          []
        );

        return walletsIds.map((id: string) => {
          return {
            id,
            isSelected: state.reportConfiguration.walletsIds.includes(id),
          };
        });
      })
    );
  }

  getAllExpenseCategoriesForReportConfiguration(): Observable<
    CategoriesReportStepItemViewModel[]
  > {
    return this._expensesState$.pipe(
      map((state: ExpensesStateModel) => {
        const selectedWalletsIds: string[] =
          state.reportConfiguration.walletsIds;
        const fromDate: Date | undefined =
          state.reportConfiguration.dates.fromDate;
        const toDate: Date | undefined = state.reportConfiguration.dates.toDate;

        const categories: string[] = state.expenses
          .reduce((total: string[], expense: ExpenseModel) => {
            if (!selectedWalletsIds.includes(expense.walletId)) {
              return total;
            }

            if (
              !!fromDate &&
              !!toDate &&
              !this._isExpenseIncludedInDates(
                expense.createdAt,
                fromDate,
                toDate
              )
            ) {
              return total;
            }

            const curExpenseCategories: string[] = expense.products.map(
              (product: ExpenseProductModel) => product.category
            );

            return [...new Set([...total, ...curExpenseCategories])];
          }, [])
          .sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));

        return categories.map((category: string) => {
          return {
            name: category,
            isSelected: state.reportConfiguration.categories.includes(category),
          };
        });
      })
    );
  }

  getAllExpenseProductsForReportConfiguration(): Observable<
    ProductReportStepItemViewModel[]
  > {
    return this._expensesState$.pipe(
      map((state: ExpensesStateModel) => {
        const selectedWalletsIds: string[] =
          state.reportConfiguration.walletsIds;
        const selectedCategories: string[] =
          state.reportConfiguration.categories;
        const fromDate: Date | undefined =
          state.reportConfiguration.dates.fromDate;
        const toDate: Date | undefined = state.reportConfiguration.dates.toDate;

        const products: string[] = state.expenses
          .reduce((total: string[], expense: ExpenseModel) => {
            if (!selectedWalletsIds.includes(expense.walletId)) {
              return total;
            }

            if (
              !!fromDate &&
              !!toDate &&
              !this._isExpenseIncludedInDates(
                expense.createdAt,
                fromDate,
                toDate
              )
            ) {
              return total;
            }

            const curExpenseProducts: string[] = expense.products.reduce(
              (acc: string[], product: ExpenseProductModel) => {
                if (
                  selectedCategories.length > 0 &&
                  !selectedCategories.includes(product.category)
                ) {
                  return acc;
                }

                return [...acc, product.name];
              },
              []
            );

            return [...new Set([...total, ...curExpenseProducts])];
          }, [])
          .sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));

        return products.map((category: string) => {
          return {
            name: category,
            isSelected: state.reportConfiguration.products.includes(category),
          };
        });
      })
    );
  }

  patchReportConfiguration(
    config: Partial<ProductReportConfigurationStateModel>
  ): Observable<void> {
    return this._expensesState$.pipe(
      take(1),
      tap((state: ExpensesStateModel) => {
        const updatedConfig: ProductReportConfigurationStateModel = {
          ...state.reportConfiguration,
          ...config,
        };
        this._expensesStateSubject.next({
          ...state,
          reportConfiguration: updatedConfig,
        });
      }),
      map(() => void 0)
    );
  }

  clearReportConfiguration(): Observable<void> {
    return this._expensesState$.pipe(
      take(1),
      tap((state: ExpensesStateModel) => {
        const updatedConfig: ProductReportConfigurationStateModel = {
          walletsIds: [],
          products: [],
          categories: [],
          dates: {
            fromDate: undefined,
            toDate: undefined,
          },
        };
        this._expensesStateSubject.next({
          ...state,
          reportConfiguration: updatedConfig,
        });
      }),
      map(() => void 0)
    );
  }

  getReportPreview(): Observable<ReportPreviewViewModel | null> {
    return this._expensesState$.pipe(
      map((state: ExpensesStateModel) => {
        const reportConfiguration:
          | ProductReportConfigurationStateModel
          | undefined = state.reportConfiguration;

        if (!reportConfiguration) {
          return null;
        }

        const fromDate: Date | undefined = reportConfiguration.dates.fromDate;
        const toDate: Date | undefined = reportConfiguration.dates.toDate;
        const selectedWalletsIds: string[] = reportConfiguration.walletsIds;

        if (!fromDate || !toDate || selectedWalletsIds.length === 0) {
          return null;
        }

        const filteredExpenses: ReportPreviewViewModel = state.expenses.reduce(
          (acc: ReportPreviewViewModel, expense: ExpenseModel) => {
            if (
              !selectedWalletsIds.includes(expense.walletId) ||
              !this._isExpenseIncludedInDates(
                expense.createdAt,
                fromDate,
                toDate
              )
            ) {
              return acc;
            }

            const filteredProducts: ExpenseProductModel[] =
              expense.products.filter(
                (product: ExpenseProductModel) =>
                  reportConfiguration.categories.includes(product.category) &&
                  reportConfiguration.products.includes(product.name)
              );

            if (filteredProducts.length === 0) {
              return acc;
            }

            const updatedExpenseTotalPrice: number = filteredProducts.reduce(
              (total: number, product: ExpenseProductModel) => {
                const productCost: number = product.price * product.quantity;
                const productCategory: string = product.category;
                acc.categoriesCostMap[productCategory] = acc.categoriesCostMap[
                  productCategory
                ]
                  ? acc.categoriesCostMap[productCategory] + productCost
                  : productCost;
                return total + productCost;
              },
              0
            );
            const updatedExpense: ExpenseModel = {
              ...expense,
              products: filteredProducts,
              totalPrice: updatedExpenseTotalPrice,
            };

            return {
              ...acc,
              expenses: [...acc.expenses, updatedExpense],
              totalCost: acc.totalCost + updatedExpenseTotalPrice,
            };
          },
          {
            expenses: [],
            totalCost: 0,
            selectedDates: {
              from: fromDate,
              to: toDate,
            },
            categoriesCostMap: {},
            categoriesCost: [],
          }
        );

        return {
          ...filteredExpenses,
          expenses: this._sortExpenses(
            {
              sortBy: SORT_TYPE.CREATED_AT,
              direction: SORT_DIRECTION.DESC,
            },
            filteredExpenses.expenses
          ),
          categoriesCost: Object.entries(filteredExpenses.categoriesCostMap)
            .map(([k, v]) => ({ category: k, cost: v }))
            .sort((a, b) => b.cost - a.cost),
        };
      })
    );
  }

  private _updateWalletBalance(
    allExpenses: ExpenseModel[],
    updatedExpense: ExpenseModel
  ): Observable<void> {
    const prevExpenseState: ExpenseModel | undefined = allExpenses.find(
      (expense: ExpenseModel) => expense.expenseId === updatedExpense.expenseId
    );
    if (!prevExpenseState) {
      return of(void 0);
    }

    const diff: number =
      prevExpenseState.totalPrice - updatedExpense.totalPrice;

    if (diff === 0 && prevExpenseState.walletId === updatedExpense.walletId) {
      return of(void 0);
    }

    if (prevExpenseState.walletId === updatedExpense.walletId) {
      return diff > 0
        ? this._walletBalance.increaseWalletBalance(
            updatedExpense.walletId,
            diff
          )
        : this._walletBalance.decreaseWalletBalance(
            updatedExpense.walletId,
            diff
          );
    }

    return this._walletBalance
      .increaseWalletBalance(
        prevExpenseState.walletId,
        prevExpenseState.totalPrice
      )
      .pipe(
        take(1),
        switchMap(() =>
          this._walletBalance.decreaseWalletBalance(
            updatedExpense.walletId,
            updatedExpense.totalPrice
          )
        ),
        map(() => void 0)
      );
  }

  private _sortExpenses(
    sort: SortModel,
    expenses: ExpenseModel[]
  ): ExpenseModel[] {
    if (sort.sortBy === SORT_TYPE.TOTAL_PRICE) {
      return expenses.sort((a, b) =>
        sort.direction === SORT_DIRECTION.ASC
          ? a.totalPrice - b.totalPrice
          : b.totalPrice - a.totalPrice
      );
    }

    if (sort.sortBy === SORT_TYPE.PRODUCTS_COUNT) {
      return expenses.sort((a, b) =>
        sort.direction === SORT_DIRECTION.ASC
          ? a.products.length - b.products.length
          : b.products.length - a.products.length
      );
    }

    return expenses.sort((a, b) =>
      sort.direction === SORT_DIRECTION.ASC
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  private _getExpensesProductsInRange(
    expenses: ExpenseModel[],
    startDate: Date,
    endDate: Date
  ): ExpenseProductModel[] {
    return expenses.reduce((acc: ExpenseProductModel[], cur: ExpenseModel) => {
      if (cur.createdAt > endDate && cur.createdAt <= startDate) {
        return [...acc, ...cur.products];
      }

      return acc;
    }, []);
  }

  private _isExpenseIncludedInDates(
    createdAt: Date,
    fromDate: Date,
    toDate: Date
  ): boolean {
    return (
      !compareDatesWithoutTime(createdAt, fromDate, isBeforeDate) &&
      !compareDatesWithoutTime(createdAt, toDate, isAfterDate)
    );
  }
}
