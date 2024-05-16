import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private readonly _baseUrl: string = 'expanses';
  constructor(private readonly _client: AngularFirestore) {}
}
