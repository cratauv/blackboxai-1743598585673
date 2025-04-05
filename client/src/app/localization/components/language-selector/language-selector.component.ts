import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {
  languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' }
  ];

  constructor(
    public translationService: TranslationService,
    public currencyService: CurrencyService
  ) {}

  changeLanguage(lang: string) {
    this.translationService.loadTranslations(lang);
  }

  changeCurrency(currency: string) {
    this.currencyService.setCurrency(currency);
  }
}