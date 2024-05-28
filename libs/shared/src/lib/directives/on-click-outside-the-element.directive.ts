import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({ selector: '[libOnClickOutsideTheElement]', standalone: true })
export class OnClickOutsideTheElementDirective {
  @Output() libOnClickOutsideTheElement: EventEmitter<void> =
    new EventEmitter<void>();
  @Input() element!: HTMLElement;

  @HostListener('document:click', ['$event'])
  onClickOnDocument(event: MouseEvent) {
    const elementRect = this.element.getBoundingClientRect();

    const isOnElementClicked: boolean =
      event.clientY >= elementRect.top &&
      event.clientY <= elementRect.bottom &&
      event.clientX >= elementRect.left &&
      event.clientX <= elementRect.right;

    if (!isOnElementClicked) {
      this.libOnClickOutsideTheElement.emit();
    }
  }
}
