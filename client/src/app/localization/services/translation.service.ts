import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = new BehaviorSubject<string>('en');
  private translations: Record<string, any> = {};

  constructor(private http: HttpClient) {}

  loadTranslations(lang: string): Promise<void> {
    return this.http.get(`/assets/i18n/${lang}.json`)
      .toPromise()
      .then(data => {
        this.translations[lang] = data;
        this.currentLanguage.next(lang);
      });
  }

  getTranslation(key: string): string {
    const lang = this.currentLanguage.value;
    return this.translations[lang]?.[key] || key;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }
}