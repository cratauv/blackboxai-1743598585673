import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../pipes/translate.pipe';
import { CurrencyPipe } from '../pipes/currency.pipe';
import { TranslationService } from './services/translation.service';
import { CurrencyService } from './services/currency.service';

@NgModule({
  declarations: [TranslatePipe, CurrencyPipe],
  imports: [CommonModule],
  providers: [TranslationService, CurrencyService],
  exports: [TranslatePipe, CurrencyPipe]
})
export class LocalizationModule { }
