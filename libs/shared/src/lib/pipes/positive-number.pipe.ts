import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  pure: false,
  name: 'positiveNumber',
})
export class PositiveNumberPipe implements PipeTransform {
  transform(value: number) {
    return Math.abs(value);
  }
}
