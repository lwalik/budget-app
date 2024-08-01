import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  LoadingComponent,
  SpinnerComponent,
  TranslationPipe,
} from '@budget-app/shared';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExpensesState } from '../../states/expenses.state';
import { Observable, shareReplay, take, tap } from 'rxjs';
import { WalletsReportStepItemViewModel } from '../../view-models/wallets-report-step-item.view-model';
import { CommonModule } from '@angular/common';
import { WalletNameComponent } from '@budget-app/wallets';

@Component({
  selector: 'lib-wallets-report-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WalletNameComponent,
    TranslationPipe,
    SpinnerComponent,
  ],
  templateUrl: './wallets-report-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsReportFormComponent extends LoadingComponent {
  readonly form: FormGroup = new FormGroup({});
  readonly wallets$: Observable<WalletsReportStepItemViewModel[]> =
    this._expensesState.getAllExpenseWalletsIdsForReportConfiguration().pipe(
      tap((wallets: WalletsReportStepItemViewModel[]) => {
        wallets.forEach((wallet: WalletsReportStepItemViewModel) => {
          const control: FormControl = new FormControl(wallet.isSelected, {
            nonNullable: true,
          });
          this.form.addControl(wallet.id, control);
        });
      }),
      shareReplay(1)
    );

  @Output() stepCompleted: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly _expensesState: ExpensesState) {
    super();
  }

  get isSubmitBtnDisabled(): boolean {
    const selectedWalletsIds: string[] = this._getSelectedWalletsIds();
    return selectedWalletsIds.length === 0;
  }

  onWalletFormSubmitted(): void {
    this.setLoading(true);
    const selectedWalletsIds: string[] = this._getSelectedWalletsIds();
    this._expensesState
      .patchReportConfiguration({
        walletsIds: selectedWalletsIds,
      })
      .pipe(take(1))
      .subscribe(() => {
        this.setLoading(false);
        this.stepCompleted.emit();
      });
  }

  private _getSelectedWalletsIds(): string[] {
    return Object.entries(this.form.value).reduce(
      (acc: string[], [walletId, isSelected]) =>
        isSelected ? [...acc, walletId] : acc,
      []
    );
  }
}
