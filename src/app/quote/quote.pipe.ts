// app/translate/translate.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quote',
  pure: false
})

export class QuotePipe implements PipeTransform {

  constructor() {}

  transform(value: string, args: any[]): any {
    if (value.length > 20) {
      return value.substring(0, 20) + '..'
    }
    return value;
  }
}
