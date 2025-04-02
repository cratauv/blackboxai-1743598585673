import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarSync } from '../../models/calendar-sync.model';

@Component({
  selector: 'app-calendar-provider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="provider-card">
      <div class="provider-header">
        <img [src]="getProviderIcon()" alt="{{calendar.provider}}" class="provider-icon">
        <h4>{{calendar.provider | titlecase}}</h4>
        <span class="email">{{calendar.email}}</span>
      </div>
      <div class="provider-status">
        <span class="status-badge" [class.connected]="calendar.syncEnabled">
          {{calendar.syncEnabled ? 'Connected' : 'Disconnected'}}
        </span>
        <span class="last-synced" *ngIf="calendar.lastSynced">
          Last synced: {{calendar.lastSynced | date:'short'}}
        </span>
      </div>
      <div class="provider-actions">
        <button *ngIf="!calendar.syncEnabled" (click)="connect.emit(calendar.provider)">
          Connect
        </button>
        <button *ngIf="calendar.syncEnabled" (click)="sync.emit(calendar.id)">
          Sync Now
        </button>
        <button *ngIf="calendar.syncEnabled" (click)="disconnect.emit(calendar.id)">
          Disconnect
        </button>
      </div>
    </div>
  `,
  styles: [`
    .provider-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .provider-header {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .provider-icon {
      width: 24px;
      height: 24px;
      margin-right: 0.5rem;
    }
    .email {
      margin-left: auto;
      color: #666;
      font-size: 0.9rem;
    }
    .provider-status {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      background: #ffebee;
      color: #f44336;
    }
    .status-badge.connected {
      background: #e6f7e6;
      color: #4CAF50;
    }
    .last-synced {
      margin-left: auto;
      font-size: 0.8rem;
      color: #666;
    }
    .provider-actions {
      display: flex;
      gap: 0.5rem;
    }
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class CalendarProviderComponent {
  @Input() calendar!: CalendarSync;
  @Output() connect = new EventEmitter<string>();
  @Output() sync = new EventEmitter<string>();
  @Output() disconnect = new EventEmitter<string>();

  getProviderIcon(): string {
    switch(this.calendar.provider) {
      case 'google': return '/assets/icons/google-calendar.svg';
      case 'outlook': return '/assets/icons/outlook-calendar.svg';
      case 'apple': return '/assets/icons/apple-calendar.svg';
      default: return '';
    }
  }
}