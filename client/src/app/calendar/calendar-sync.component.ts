import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarProviderComponent } from './calendar-provider/calendar-provider.component';
import { CalendarSyncService } from './calendar-sync.service';
import { CalendarSync } from '../models/calendar-sync.model';

@Component({
  selector: 'app-calendar-sync',
  standalone: true,
  imports: [CommonModule, CalendarProviderComponent],
  template: `
    <div class="calendar-sync-container">
      <h2>Calendar Sync</h2>
      <div *ngIf="isLoading" class="loading">Loading...</div>
      <div *ngIf="!isLoading && calendars.length === 0" class="empty">
        No calendars connected
      </div>
      <app-calendar-provider 
        *ngFor="let calendar of calendars"
        [calendar]="calendar"
        (connect)="connectCalendar($event)"
        (sync)="syncCalendar($event)"
        (disconnect)="disconnectCalendar($event)">
      </app-calendar-provider>
      <div class="add-calendar">
        <h3>Connect New Calendar</h3>
        <div class="provider-options">
          <button (click)="connectCalendar('google')">
            <img src="/assets/icons/google-calendar.svg" alt="Google Calendar">
            Google Calendar
          </button>
          <button (click)="connectCalendar('outlook')">
            <img src="/assets/icons/outlook-calendar.svg" alt="Outlook Calendar">
            Outlook Calendar
          </button>
          <button (click)="connectCalendar('apple')">
            <img src="/assets/icons/apple-calendar.svg" alt="Apple Calendar">
            Apple Calendar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-sync-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
    }
    .loading, .empty {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    .add-calendar {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #eee;
    }
    .provider-options {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .provider-options button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      cursor: pointer;
    }
    .provider-options button img {
      width: 40px;
      height: 40px;
      margin-bottom: 0.5rem;
    }
  `]
})
export class CalendarSyncComponent {
  calendars: CalendarSync[] = [];
  isLoading = true;

  constructor(private calendarSyncService: CalendarSyncService) {}

  ngOnInit() {
    this.loadCalendars();
  }

  loadCalendars() {
    this.isLoading = true;
    this.calendarSyncService.getConnectedCalendars().subscribe({
      next: (calendars) => {
        this.calendars = calendars;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  connectCalendar(provider: string) {
    this.calendarSyncService.connectCalendar(provider).subscribe({
      next: (response) => {
        // Open OAuth flow in new window
        window.open(response.authUrl, '_blank');
        // Poll for connection status
        this.pollForConnection(provider);
      }
    });
  }

  pollForConnection(provider: string) {
    const interval = setInterval(() => {
      this.calendarSyncService.getConnectedCalendars().subscribe(calendars => {
        const connected = calendars.find(c => c.provider === provider && c.syncEnabled);
        if (connected) {
          clearInterval(interval);
          this.calendars = calendars;
        }
      });
    }, 2000);
  }

  syncCalendar(calendarId: string) {
    this.calendarSyncService.syncCalendar(calendarId).subscribe({
      next: () => {
        this.loadCalendars();
      }
    });
  }

  disconnectCalendar(calendarId: string) {
    if (confirm('Are you sure you want to disconnect this calendar?')) {
      this.calendarSyncService.disconnectCalendar(calendarId).subscribe({
        next: () => {
          this.loadCalendars();
        }
      });
    }
  }
}