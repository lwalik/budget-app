import { Inject, Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ENV_CONFIG, EnvConfig } from '@budget-app/core';
import { mapPromiseToVoidObservable } from '@budget-app/shared';
import { Timestamp } from 'firebase/firestore';
import { Observable, map, switchMap, take } from 'rxjs';
import { ExpenseModel } from '../models/expense.model';
import {
  ExpenseResponse,
  UserExpenseResponse,
} from '../responses/expense.response';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  constructor(
    private readonly _client: AngularFirestore,
    @Inject(ENV_CONFIG) private _envConfig: EnvConfig
  ) {}

  getAll(userId: string): Observable<ExpenseModel[]> {
    return this._getExpensesDoc(userId)
      .valueChanges({ idFields: 'id' })
      .pipe(
        map((resp: UserExpenseResponse | undefined) =>
          resp ? resp.expenses : []
        ),
        map((expenses: ExpenseResponse[]) =>
          expenses.map((expense: ExpenseResponse) => ({
            ...expense,
            createdAt: expense.createdAt.toDate(),
          }))
        )
      );
  }

  add(
    expense: Omit<ExpenseModel, 'id' | 'createdAt' | 'expenseId'>,
    userId: string
  ): Observable<ExpenseModel> {
    const expenseId: string = this._client.createId();
    const expensesDoc: AngularFirestoreDocument<UserExpenseResponse> =
      this._getExpensesDoc(userId);

    return expensesDoc.valueChanges({ idFields: 'id' }).pipe(
      take(1),
      switchMap((data: UserExpenseResponse | undefined) => {
        const newExpense: ExpenseModel = {
          ...expense,
          id: expenseId,
          expenseId,
          createdAt: new Date(),
        };

        if (!data) {
          return mapPromiseToVoidObservable(
            expensesDoc.set({
              expenses: [
                {
                  ...newExpense,
                  createdAt: Timestamp.fromDate(newExpense.createdAt),
                },
              ],
            })
          ).pipe(map(() => newExpense));
        }

        return mapPromiseToVoidObservable(
          expensesDoc.update({
            expenses: [
              ...data.expenses,
              {
                ...newExpense,
                createdAt: Timestamp.fromDate(newExpense.createdAt),
              },
            ],
          })
        ).pipe(map(() => newExpense));
      })
    );
  }

  private _getExpensesDoc(
    userId: string
  ): AngularFirestoreDocument<UserExpenseResponse> {
    return this._client.doc<UserExpenseResponse>(
      `${this._envConfig.expansesUrl}/` + userId
    );
  }
}
