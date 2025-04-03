import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingOptionsAdminService } from './booking-options-admin.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-options-list-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-options">
      <div class="header">
        <h2>Manage Booking Options</h2>
        <a routerLink="/admin/booking-options/new" class="add-button">+ Add New</a>
      </div>

      <div *ngIf="loading" class="loading">Loading options...</div>
      <div *ngIf="error" class="error">{{error}}</div>

      <div class="options-grid">
        <div *ngFor="let option of options" class="option-card">
          <div class="option-image" [style.backgroundImage]="'url(' + option.imageUrl + ')'"></div>
          <div class="option-details">
            <h3>{{option.name}}</h3>
            <p>{{option.description}}</p>
            <div class="meta">
              <span>${{option.price}}</span>
              <span>{{option.duration}} mins</span>
              <span [class.active]="option.active" [class.inactive]="!option.active">
                {{option.active ? 'Active' : 'Inactive'}}
              </span>
            </div>
          </div>
          <div class="option-actions">
            <a [routerLink]="['/admin/booking-options/edit', option.id]" class="edit">Edit</a>
            <button (click)="toggleActive(option)" class="toggle">
              {{option.active ? 'Deactivate' : 'Activate'}}
            </button>
            <button (click)="deleteOption(option.id)" class="delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-options {
      padding: 2rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .add-button {
      padding: 0.5rem 1rem;
      background: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .option-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .option-image {
      height: 150px;
      background-size: cover;
      background-position: center;
    }
    .option-details {
      padding: 1rem;
    }
    .meta {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
      font-size: 0.9rem;
    }
    .active {
      color: #2e7d32;
    }
    .inactive {
      color: #c62828;
    }
    .option-actions {
      display: flex;
      padding: 0.5rem;
      border-top: 1px solid #eee;
    }
    .option-actions button, .option-actions a {
      flex: 1;
      padding: 0.5rem;
      text-align: center;
      cursor: pointer;
    }
    .edit {
      color: #1976d2;
      text-decoration: none;
    }
    .toggle {
      background: none;
      border: none;
    }
    .delete {
      color: #c62828;
      background: none;
      border: none;
    }
  `]
})
export class BookingOptionsListAdminComponent implements OnInit {
  options: any[] = [];
  loading = false;
  error = '';

  constructor(private optionsService: BookingOptionsAdminService) {}

  ngOnInit() {
    this.loadOptions();
  }

  loadOptions() {
    this.loading = true;
    this.optionsService.getBookingOptions().subscribe({
      next: (options) => {
        this.options = options;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load options';
        this.loading = false;
      }
    });
  }

  toggleActive(option: any) {
    const updates = { active: !option.active };
    this.optionsService.updateBookingOption(option.id, updates).subscribe({
      next: () => this.loadOptions(),
      error: () => alert('Failed to update option')
    });
  }

  deleteOption(id: string) {
    if (confirm('Are you sure you want to delete this option?')) {
      this.optionsService.deleteBookingOption(id).subscribe({
        next: () => this.loadOptions(),
        error: () => alert('Failed to delete option')
      });
    }
  }
}