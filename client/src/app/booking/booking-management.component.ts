import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingManagementService } from './booking-management.service';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="booking-management">
      <div class="action-section">
        <h3>Modify Booking</h3>
        
        <div class="form-group">
          <label>New Date</label>
          <input type="date" [(ngModel)]="newDate" [min]="minDate">
        </div>
        
        <div class="form-group">
          <label>New Time</label>
          <select [(ngModel)]="newTime">
            <option *ngFor="let slot of timeSlots" [value]="slot">{{slot}}</option>
          </select>
        </div>
        
        <div class="action-buttons">
          <button (click)="onReschedule()" [disabled]="!canReschedule()">Reschedule</button>
          <button class="cancel-btn" (click)="onCancel()">Cancel Booking</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-management {
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 8px;
      margin-top: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .cancel-btn {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class BookingManagementComponent {
  @Input() bookingId!: string;
  @Input() currentDate!: string;
  @Input() currentTime!: string;
  @Output() updated = new EventEmitter<void>();

  newDate = '';
  newTime = '';
  timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  minDate = new Date().toISOString().split('T')[0];

  constructor(private bookingService: BookingManagementService) {
    this.newDate = this.currentDate;
    this.newTime = this.currentTime;
  }

  canReschedule() {
    return this.newDate && this.newTime && 
          (this.newDate !== this.currentDate || this.newTime !== this.currentTime);
  }

  onReschedule() {
    if (confirm('Are you sure you want to reschedule this booking?')) {
      this.bookingService.rescheduleBooking(this.bookingId, this.newDate, this.newTime)
        .subscribe({
          next: () => {
            alert('Booking rescheduled successfully');
            this.updated.emit();
          },
          error: () => alert('Failed to reschedule booking')
        });
    }
  }

  onCancel() {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(this.bookingId)
        .subscribe({
          next: () => {
            alert('Booking cancelled successfully');
            this.updated.emit();
          },
          error: () => alert('Failed to cancel booking')
        });
    }
  }
}