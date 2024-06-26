import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';

@Directive({ selector: '[libEmotionTextDirective]', standalone: true })
export class EmotionTextDirective implements OnInit, OnDestroy {
  private readonly _valueSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private readonly _onDestroy: Subject<void> = new Subject<void>();
  @Input() set libEmotionTextDirective(value: number) {
    this._valueSubject.next(value);
  }

  constructor(
    private readonly _elementRef: ElementRef,
    private readonly _renderer: Renderer2
  ) {}

  ngOnInit() {
    this._valueSubject
      .asObservable()
      .pipe(
        takeUntil(this._onDestroy.asObservable()),
        tap((value: number) => {
          const nativeElement = this._elementRef.nativeElement;
          if (value === 0) {
            this._renderer.addClass(nativeElement, 'neutral-text');
            return;
          }

          if (value > 0) {
            this._renderer.addClass(nativeElement, 'positive-text');
            return;
          }

          if (value < 0) {
            this._renderer.addClass(nativeElement, 'negative-text');
            return;
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
  }
}
