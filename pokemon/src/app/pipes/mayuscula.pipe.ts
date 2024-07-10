import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mayuscula',
  standalone: true
})
export class MayusculaPipe implements PipeTransform {

  transform(value: string): string {
    return value.toUpperCase();
  }

}
