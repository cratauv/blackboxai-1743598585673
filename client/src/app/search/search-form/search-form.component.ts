import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchCriteria } from '../../models/search.model';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="search-form" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <input type="text" [(ngModel)]="criteria.query" name="query" placeholder="Search...">
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Location</label>
          <input type="text" [(ngModel)]="criteria.location" name="location">
        </div>
        
        <div class="form-group">
          <label>Date Range</label>
          <div class="date-range">
            <input type="date" [(ngModel)]="criteria.startDate" name="startDate">
            <span>to</span>
            <input type="date" [(ngModel)]="criteria.endDate" name="endDate">
          </div>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Price Range</label>
          <div class="price-range">
            <input type="number" [(ngModel)]="criteria.minPrice" name="minPrice" placeholder="Min">
            <span>to</span>
            <input type="number" [(ngModel)]="criteria.maxPrice" name="maxPrice" placeholder="Max">
          </div>
        </div>
        
        <div class="form-group">
          <label>Minimum Rating</label>
          <select [(ngModel)]="criteria.rating" name="rating">
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      
      <button type="submit">Search</button>
    </form>
  `,
  styles: [`
    .search-form {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .form-row .form-group {
      flex: 1;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    input, select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .date-range, .price-range {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    button {
      background: #0066cc;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class SearchFormComponent {
  @Output() search = new EventEmitter<SearchCriteria>();
  criteria: SearchCriteria = {};

  onSubmit() {
    this.search.emit(this.criteria);
  }
}