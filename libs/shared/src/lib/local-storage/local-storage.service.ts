import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE_TOKEN } from './local-storage.token';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE_TOKEN) private storage: Storage) {}

  setItem<T>(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T {
    const item = this.storage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }
}
