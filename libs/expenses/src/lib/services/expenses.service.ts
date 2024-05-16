import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ENV_CONFIG, EnvConfig } from '@budget-app/core';
import { map, Observable } from 'rxjs';
import { ExpenseModel } from '../models/expense.model';
import { ExpenseResponse } from '../responses/expense.response';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  constructor(
    private readonly _client: AngularFirestore,
    @Inject(ENV_CONFIG) private _envConfig: EnvConfig
  ) {}

  getAll(userId: string): Observable<ExpenseModel[]> {
    return this._client
      .collection<ExpenseResponse>(this._envConfig.expansesUrl, (ref) =>
        ref.where('ownerId', '==', userId).orderBy('createdAt', 'desc')
      )
      .valueChanges({ idFields: 'id' })
      .pipe(
        map((expenses: ExpenseResponse[]) =>
          expenses.map((expense: ExpenseResponse) => ({
            ...expense,
            createdAt: expense.createdAt.toDate(),
          }))
        )
      );
  }
}
