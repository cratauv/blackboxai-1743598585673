import { Component, OnInit } from '@angular/core';
import { BookingOptionsService } from '../booking-options.service';

@Component({
  selector: 'app-booking-options-list',
  template: `
    <div class="booking-options">
      <div *ngFor="let option of bookingOptions" class="option-card">
        <h3>{{option.name}}</h3>
        <p>{{option.description}}</p>
        <p>Price: {{option.displayPrice || option.price}} {{option.displayCurrency || option.currency}}</p>
        <button (click)="viewReviews(option._id)">View Reviews</button>
      </div>
    </div>
  `,
  styles: [`
    .booking-options {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .option-card {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 5px;
    }
  `]
})
export class BookingOptionsListComponent implements OnInit {
  bookingOptions: any[] = [];

  constructor(private bookingService: BookingOptionsService) {}

  ngOnInit(): void {
    this.bookingService.getBookingOptions().subscribe(
      (data) => this.bookingOptions = data,
      (error) => console.error(error)
    );
  }

  viewReviews(optionId: string): void {
    // Navigation to be implemented
  }
}