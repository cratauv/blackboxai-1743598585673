import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNotification } from '../models/notification.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <mat-card [class]="'notification-' + notification.type">
      <div class="notification-header">
        <mat-icon [class]="'icon-' + notification.type">
          {{ getIcon(notification.type) }}
        </mat-icon>
        <h3>{{ notification.title }}</h3>
        <span class="timestamp">{{ notification.timestamp | date:'short' }}</span>
      </div>
      <p>{{ notification.message }}</p>
      <button *ngIf="notification.action" 
              mat-button 
              color="primary"
              (click)="handleAction()">
        {{ notification.action.label }}
      </button>
    </mat-card>
  `,
  styles: [`
    mat-card {
      margin-bottom: 1rem;
      padding: 1rem;
      border-left: 4px solid;
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
    .timestamp {
      margin-left: auto;
      font-size: 0.8rem;
      color: #666;
    }
  `]
})
export class NotificationItemComponent {
  @Input() notification!: AppNotification;

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      info: 'info',
      success: 'check_circle',
      warning: 'warning',
      error: 'error'
    };
    return icons[type] || 'notifications';
  }

  handleAction() {
    if (this.notification.action) {
      this.notification.action.callback();
    }
  }
}