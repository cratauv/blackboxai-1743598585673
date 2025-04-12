import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingOption } from '../booking-options.service';

@Component({
  selector: 'app-booking-option-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.selected]="isSelected">
      <div class="card-header">
        <h3>{{option.name}}</h3>
        <span class="price">{{option.price | currency}}</span>
      </div>
      <div class="card-body">
        <p>{{option.description}}</p>
        <div class="features" *ngIf="option.features">
          <span *ngFor="let feature of option.features" class="feature-badge">
            {{feature}}
          </span>
        </div>
      </div>
      <div class="card-footer">
        <button (click)="onSelect()">Select</button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      margin: 0.5rem;
      transition: all 0.2s;
    }
    .card.selected {
      border-color: #3f51b5;
      background-color: #f5f5f5;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .price {
      font-weight: bold;
      color: #3f51b5;
    }
    .features {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .feature-badge {
      background: #e0e0e0;
      padding: 0.25rem 0.5rem;
      border-radius: 16px;
      font-size: 0.8rem;
    }
    button {
      background: #3f51b5;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class BookingOptionCardComponent {
  @Input() option!: BookingOption;
  @Input() isSelected = false;
  @Output() selected = new EventEmitter<BookingOption>();

  onSelect() {
    this.selected.emit(this.option);
  }
}