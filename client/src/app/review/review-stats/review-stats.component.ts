import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewStats } from '../../models/review.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-review-stats',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  template: `
    <div class="review-stats">
      <div class="overall-rating">
        <span class="average">{{stats.averageRating.toFixed(1)}}</span>
        <app-star-rating [rating]="stats.averageRating"></app-star-rating>
        <span class="count">{{stats.totalReviews}} reviews</span>
      </div>
      <div class="rating-bars">
        <div *ngFor="let rating of [5,4,3,2,1]" class="rating-bar">
          <span class="stars">{{rating}}★</span>
          <div class="bar-container">
            <div class="bar" [style.width.%]="getPercentage(rating)"></div>
          </div>
          <span class="count">{{stats.ratingDistribution[rating]}}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .review-stats {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
    }
    .overall-rating {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    .average {
      font-size: 2rem;
      font-weight: bold;
      margin-right: 1rem;
    }
    .count {
      margin-left: 1rem;
      color: #666;
    }
    .rating-bars {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .rating-bar {
      display: flex;
      align-items: center;
    }
    .stars {
      width: 30px;
    }
    .bar-container {
      flex-grow: 1;
      height: 10px;
      background: #e9ecef;
      border-radius: 5px;
      margin: 0 0.5rem;
    }
    .bar {
      height: 100%;
      background: #ffc107;
      border-radius: 5px;
    }
  `]
})
export class ReviewStatsComponent {
  @Input() stats!: ReviewStats;

  getPercentage(rating: 5|4|3|2|1): number {
    const count = this.stats.ratingDistribution[rating];
    return (count / this.stats.totalReviews) * 100;
  }
}