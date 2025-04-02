import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking-option-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="booking-card">
      <img [src]="option.imageUrl" [alt]="option.name" class="card-image">
      <div class="card-content">
        <h3>{{ option.name }}</h3>
        <div class="rating">
          <span *ngFor="let star of [1,2,3,4,5]">
            {{ star <= option.rating ? '★' : '☆' }}
          </span>
        </div>
        <p class="description">{{ option.description | truncate:100 }}</p>
        <div class="details">
          <span class="price">{{ option.price | currency }}</span>
          <span class="duration">{{ option.duration }} mins</span>
        </div>
        <a [routerLink]="['/bookings', option.id]" class="book-button">Book Now</a>
      </div>
    </div>
  `,
  styles: [`
    .booking-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s;
    }
    .booking-card:hover {
      transform: translateY(-5px);
    }
    .card-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .card-content {
      padding: 1rem;
    }
    .rating {
      color: gold;
      margin: 0.5rem 0;
    }
    .details {
      display: flex;
      justify-content: space-between;
      margin: 1rem 0;
    }
    .price {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .book-button {
      display: block;
      text-align: center;
      background: #3498db;
      color: white;
      padding: 0.5rem;
      border-radius: 4px;
      text-decoration: none;
    }
  `]
})
export class BookingOptionCardComponent {
  @Input() option: any;
}