import { Component, Input } from '@angular/core';
import { BookingOptionsService } from '../booking-options.service';

interface Review {
  _id: string;
  user: any;
  rating: number;
  comment: string;
  language: string;
  status: string;
  createdAt: Date;
}

@Component({
  selector: 'app-review-list',
  template: `
    <div class="reviews">
      <div *ngFor="let review of reviews" class="review-card">
        <div class="review-header">
          <span class="rating">Rating: {{review.rating}}/5</span>
          <span class="language">{{review.language | uppercase}}</span>
        </div>
        <p class="comment">{{review.comment}}</p>
        <div class="review-footer">
          <span class="user">{{review.user?.name}}</span>
          <span class="date">{{review.createdAt | date}}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 20px;
    }
    .review-card {
      border: 1px solid #eee;
      padding: 15px;
      border-radius: 5px;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .review-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 0.8em;
      color: #666;
    }
    .rating {
      font-weight: bold;
    }
  `]
})
export class ReviewListComponent {
  @Input() reviews: Review[] = [];
}