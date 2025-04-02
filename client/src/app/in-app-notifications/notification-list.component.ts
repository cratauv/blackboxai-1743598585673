import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationItemComponent } from './notification-item-new.component';
import { AppNotification } from '../models/notification.model';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, NotificationItemComponent],
  template: `
    <div class="notification-list">
      <h2 *ngIf="notifications.length > 0">Notifications</h2>
      <div *ngIf="notifications.length === 0" class="empty-state">
        No new notifications
      </div>
      <app-notification-item 
        *ngFor="let notification of notifications"
        [notification]="notification">
      </app-notification-item>
    </div>
  `,
  styles: [`
    .notification-list {
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class NotificationListComponent {
  @Input() notifications: AppNotification[] = [];
}