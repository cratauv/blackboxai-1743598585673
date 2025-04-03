import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityCheckerService } from './availability-checker.service';

@Component({
  selector: 'app-real-time-availability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="real-time-availability">
      <h3>Real-time Availability</h3>
      <div *ngIf="isPolling" class="status-message">
        <span *ngIf="isAvailable" class="available">✓ Currently Available</span>
        <span *ngIf="!isAvailable" class="unavailable">✗ Currently Booked</span>
      </div>
      <button (click)="togglePolling()">
        {{ isPolling ? 'Stop' : 'Start' }} Real-time Updates
      </button>
    </div>
  `,
  styles: [`
    .real-time-availability {
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 4px;
      margin-top: 1rem;
    }
    .status-message {
      margin: 1rem 0;
      font-weight: bold;
    }
    .available {
      color: #2e7d32;
    }
    .unavailable {
      color: #c62828;
    }
  `]
})
export class RealTimeAvailabilityComponent implements OnInit, OnDestroy {
  @Input() optionId!: string;
  @Input() date!: string;
  @Input() time!: string;

  isAvailable = false;
  isPolling = false;

  constructor(private availabilityService: AvailabilityCheckerService) {}

  ngOnInit() {
    if (this.date && this.time) {
      this.startPolling();
    }
  }

  ngOnDestroy() {
    this.availabilityService.stopPolling();
  }

  togglePolling() {
    this.isPolling ? this.stopPolling() : this.startPolling();
  }

  startPolling() {
    this.isPolling = true;
    this.availabilityService.startPollingAvailability(
      this.optionId,
      this.date,
      this.time
    );
    this.availabilityService.availability$.subscribe(
      available => this.isAvailable = available
    );
  }

  stopPolling() {
    this.isPolling = false;
    this.availabilityService.stopPolling();
  }
}