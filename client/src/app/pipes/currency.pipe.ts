import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../localization/services/currency.service';

@Pipe({
  name: 'currencyFormat',
  pure: false
})
export class CurrencyPipe implements PipeTransform {
  constructor(private currencyService: CurrencyService) {}

  transform(amount: number, currencyCode?: string): string {
    return this.currencyService.formatAmount(amount, currencyCode);
  }
}