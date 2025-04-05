import { Component, OnInit } from '@angular/core';
import { TranslationService } from './localization/services/translation.service';
import { NotificationCenterComponent } from './in-app-notifications/notification-center.component';
import { NotificationService } from './in-app-notifications/notification.service';
import { AnalyticsDashboardComponent } from './analytics/analytics-dashboard-new.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.translationService.loadTranslations('en'); // Load default language
  }
}
