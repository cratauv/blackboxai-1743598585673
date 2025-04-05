import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currentCurrency = new BehaviorSubject<string>('USD');
  private exchangeRates: Record<string, number> = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.15
  };

  setCurrency(currencyCode: string) {
    if (this.exchangeRates[currencyCode]) {
      this.currentCurrency.next(currencyCode);
    }
  }

  getCurrentCurrency(): string {
    return this.currentCurrency.value;
  }

  convertAmount(amount: number, fromCurrency: string, toCurrency?: string): number {
    toCurrency = toCurrency || this.currentCurrency.value;
    const baseAmount = amount / this.exchangeRates[fromCurrency];
    return baseAmount * this.exchangeRates[toCurrency];
  }

  formatAmount(amount: number, currencyCode?: string): string {
    currencyCode = currencyCode || this.currentCurrency.value;
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  }
}