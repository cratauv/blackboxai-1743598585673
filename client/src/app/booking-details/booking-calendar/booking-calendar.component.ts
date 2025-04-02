import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatNativeDateModule],
  template: `
    <div class="calendar-container">
      <h3>Select Booking Date</h3>
      <mat-datepicker #picker></mat-datepicker>
      <input 
        matInput 
        [matDatepicker]="picker"
        (dateChange)="onDateSelect($event)"
        placeholder="Choose a date"
      >
      <div *ngIf="selectedDate" class="time-slots">
        <h4>Available Time Slots</h4>
        <div class="slot-grid">
          <button 
            *ngFor="let slot of timeSlots"
            (click)="selectTimeSlot(slot)"
            class="time-slot"
          >
            {{ slot }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      margin-top: 2rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .time-slots {
      margin-top: 1rem;
    }
    .slot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .time-slot {
      padding: 0.5rem;
      background: #f5f5f5;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .time-slot:hover {
      background: #e0e0e0;
    }
  `]
})
export class BookingCalendarComponent {
  @Input() selectedDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() timeSlotSelected = new EventEmitter<string>();

  timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM'
  ];

  onDateSelect(event: any) {
    this.selectedDate = event.value;
    this.dateSelected.emit(event.value);
  }

  selectTimeSlot(slot: string) {
    this.timeSlotSelected.emit(slot);
  }
}