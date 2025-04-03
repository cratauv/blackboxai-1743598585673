import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { CalendarService } from '../calendar.service';
import { Availability } from '../../models/availability.model';

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  imports: [CommonModule, CalendarModule],
  template: `
    <div class="calendar-container">
      <p-calendar 
        [(ngModel)]="date"
        [inline]="true"
        [showWeek]="true"
        (onMonthChange)="loadAvailability($event)"
        [dateTemplate]="dateTemplate">
      </p-calendar>
      <ng-template #dateTemplate let-date>
        <div class="date-cell" [class.available]="isAvailable(date)">
          {{date.day}}
          <div *ngIf="isAvailable(date)" class="availability-indicator">
            {{getAvailableSlots(date)}} slots
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .calendar-container {
      max-width: 400px;
      margin: 0 auto;
    }
    .date-cell {
      position: relative;
      height: 100%;
      padding: 0.25rem;
    }
    .available {
      background-color: #e6f7e6;
    }
    .availability-indicator {
      font-size: 0.7rem;
      color: #4CAF50;
    }
  `]
})
export class CalendarComponent {
  @Input() date: Date = new Date();
  availability: Availability[] = [];

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.loadAvailability({ year: this.date.getFullYear(), month: this.date.getMonth() });
  }

  loadAvailability(event: any) {
    this.calendarService.getMonthlyAvailability(event.year, event.month + 1)
      .subscribe(availability => {
        this.availability = availability;
      });
  }

  isAvailable(date: Date): boolean {
    const avail = this.availability.find(a => 
      new Date(a.date).toDateString() === date.toDateString()
    );
    return avail ? avail.available : false;
  }

  getAvailableSlots(date: Date): number {
    const avail = this.availability.find(a => 
      new Date(a.date).toDateString() === date.toDateString()
    );
    return avail ? avail.availableSlots : 0;
  }
}