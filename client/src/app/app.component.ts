import { Component } from '@angular/core';
import { NotificationCenterComponent } from './in-app-notifications/notification-center.component';
import { NotificationService } from './in-app-notifications/notification.service';
import { AnalyticsDashboardComponent } from './analytics/analytics-dashboard-new.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Booking Options Reviews</h1>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
  `]
})
export class AppComponent {}