import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNotification } from '../models/notification.model';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification" [class]="'notification-' + notification.type">
      <div class="notification-header">
        <span class="icon" [class]="'icon-' + notification.type">
          {{ getIcon(notification.type) }}
        </span>
        <h3>{{ notification.title }}</h3>
        <span class="timestamp">{{ notification.timestamp | date:'short' }}</span>
      </div>
      <p>{{ notification.message }}</p>
      <button *ngIf="notification.action" 
              class="action-button"
              (click)="handleAction()">
        {{ notification.action.label }}
      </button>
    </div>
  `,
  styles: [`
    .notification {
      margin-bottom: 1rem;
      padding: 1rem;
      border-left: 4px solid;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .notification-info {
      border-left-color: #2196F3;
    }
    .notification-success {
      border-left-color: #4CAF50;
    }
    .notification-warning {
      border-left-color: #FFC107;
    }
    .notification-error {
      border-left-color: #F44336;
    }
    .notification-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .icon {
      font-family: 'Material Icons';
    }
    .timestamp {
      margin-left: auto;
      font-size: 0.8rem;
      color: #666;
    }
    .action-button {
      background: #f0f0f0;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .action-button:hover {
      background: #e0e0e0;
    }
  `]
})
export class NotificationItemComponent {
  @Input() notification!: AppNotification;

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      info: 'ℹ️',
      success: '✅', 
      warning: '⚠️',
      error: '❌'
    };
    return icons[type] || '🔔';
  }

  handleAction() {
    if (this.notification.action) {
      this.notification.action.callback();
    }
  }
}