import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AvailabilityService } from './availability.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-availability-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="availability-indicator" [class.available]="isAvailable" [class.unavailable]="!isAvailable">
      <span *ngIf="isAvailable">✓ Available</span>
      <span *ngIf="!isAvailable && !loading">✗ Unavailable</span>
      <span *ngIf="loading">Checking availability...</span>
    </div>
  `,
  styles: [`
    .availability-indicator {
      padding: 0.5rem;
      border-radius: 4px;
      margin-top: 0.5rem;
      font-weight: bold;
    }
    .available {
      background-color: #e6f7e6;
      color: #2e7d32;
    }
    .unavailable {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class AvailabilityIndicatorComponent implements OnChanges {
  @Input() optionId: string = '';
  @Input() date: string = '';
  @Input() time: string = '';

  isAvailable: boolean = false;
  loading: boolean = false;

  constructor(private availabilityService: AvailabilityService) {}

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['date'] || changes['time']) && this.date && this.time) {
      this.checkAvailability();
    }
  }

  checkAvailability() {
    this.loading = true;
    this.availabilityService.checkRealTimeAvailability(this.optionId, this.date, this.time)
      .subscribe({
        next: (available) => {
          this.isAvailable = available;
          this.loading = false;
        },
        error: () => {
          this.isAvailable = false;
          this.loading = false;
        }
      });
  }
}