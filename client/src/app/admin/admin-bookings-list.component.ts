import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminBookingsService } from './admin-bookings.service';

@Component({
  selector: 'app-admin-bookings-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  template: `
    <div class="admin-bookings">
      <h2>Manage Bookings</h2>
      
      <div class="filters">
        <input type="text" [(ngModel)]="searchTerm" placeholder="Search bookings...">
        <select [(ngModel)]="statusFilter">
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div *ngIf="loading" class="loading">Loading bookings...</div>
      <div *ngIf="error" class="error">{{error}}</div>
      
      <table *ngIf="bookings.length > 0">
        <thead>
          <tr>
            <th>User</th>
            <th>Service</th>
            <th>Date/Time</th>
            <th>Status</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let booking of filteredBookings">
            <td>{{booking.userName}}</td>
            <td>{{booking.optionName}}</td>
            <td>{{booking.date | date}} at {{booking.time}}</td>
            <td>
              <span [class]="booking.status">{{booking.status}}</span>
            </td>
            <td>{{booking.price | currency}}</td>
            <td class="actions">
              <button (click)="editBooking(booking)">Edit</button>
              <button *ngIf="booking.status === 'confirmed'" 
                      (click)="cancelBooking(booking.id)"
                      class="cancel">
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div *ngIf="bookings.length === 0 && !loading" class="empty">
        No bookings found
      </div>
    </div>
  `,
  styles: [`
    .admin-bookings {
      padding: 2rem;
    }
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .confirmed {
      color: #2e7d32;
    }
    .cancelled {
      color: #c62828;
    }
    .completed {
      color: #1565c0;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .cancel {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class AdminBookingsListComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  statusFilter = '';

  constructor(private bookingsService: AdminBookingsService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingsService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.filterBookings();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bookings';
        this.loading = false;
      }
    });
  }

  filterBookings() {
    this.filteredBookings = this.bookings.filter(booking => {
      const matchesSearch = booking.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          booking.optionName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || booking.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  editBooking(booking: any) {
    // Implementation would open edit modal/dialog
    console.log('Edit booking:', booking);
  }

  cancelBooking(bookingId: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingsService.cancelBooking(bookingId).subscribe({
        next: () => this.loadBookings(),
        error: () => alert('Failed to cancel booking')
      });
    }
  }
}