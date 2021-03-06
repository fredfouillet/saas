import { Pipe, PipeTransform } from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Pipe({name: 'round'})
export class RoundPipe implements PipeTransform {
  transform (input: number) {
    return Math.round(input)
  }
}


@Pipe({name: 'currency'})
export class CurrencyPipe implements PipeTransform {

  constructor(
    public authService: AuthService,
  ) {
  }

  transform (input:number) {
    let currency: string = ''
    let returnValue: string = '' + input
    this.authService.getCurrentUser().ownerCompanies.forEach(companie => {
      currency = companie.option.currency
    })

    if(currency === '$') {
      returnValue = '$' + input
    }
    if(currency === '€') {
      returnValue =  input + ' €'
    }

    return returnValue
  }
}


@Pipe({name: 'smallText'})
export class SmallTextPipe implements PipeTransform {
  constructor() {}
  transform(value: string, args: any[]): any {
    if (value.length > 17) {
      return value.substring(0, 17) + '..'
    }
    return value;
  }
}

@Pipe({name: 'mediumText'})
export class MediumTextPipe implements PipeTransform {
  constructor() {}
  transform(value: string, args: any[]): any {
    if (value.length > 40) {
      return value.substring(0, 40) + '..'
    }
    return value;
  }
}
