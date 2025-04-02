import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationListComponent } from './notification-list.component';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, NotificationListComponent],
  template: `
    <div class="notification-center">
      <app-notification-list 
        [notifications]="notifications$ | async">
      </app-notification-list>
    </div>
  `,
  styles: [`
    .notification-center {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 1rem;
    }
  `]
})
export class NotificationCenterComponent {
  notifications$ = this.notificationService.notifications$;

  constructor(private notificationService: NotificationService) {}
}