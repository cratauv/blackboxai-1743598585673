import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BookingOptionsService } from '../booking-options.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingOptionCardComponent } from '../booking-option-card/booking-option-card.component';

@Component({
  selector: 'app-booking-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, BookingOptionCardComponent],
  template: `
    <div class="search-container">
      <div class="search-header">
        <h2>Find Your Perfect Booking</h2>
        <div class="search-box">
          <input 
            type="text" 
            [formControl]="searchControl" 
            placeholder="Search by name, category..."
          >
          <button (click)="onSearch()">Search</button>
        </div>
      </div>

      <div class="filters">
        <!-- Filter controls would go here -->
      </div>

      <div class="results">
        <div *ngIf="isLoading" class="loading">Loading...</div>
        <div *ngIf="error" class="error">{{ error }}</div>
        
        <div class="options-grid">
          <app-booking-option-card 
            *ngFor="let option of options"
            [option]="option"
          ></app-booking-option-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      padding: 2rem;
    }
    .search-header {
      margin-bottom: 2rem;
    }
    .search-box {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
  `]
})
export class SearchComponent {
  searchControl = new FormControl('');
  options: any[] = [];
  isLoading = false;
  error = '';

  constructor(private bookingService: BookingOptionsService) {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        this.isLoading = true;
        return this.bookingService.searchOptions(query || '');
      })
    ).subscribe({
      next: options => {
        this.options = options;
        this.isLoading = false;
      },
      error: err => {
        this.error = 'Failed to load options';
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    // Explicit search trigger
  }
}