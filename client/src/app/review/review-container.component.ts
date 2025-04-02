import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewStatsComponent } from './review-stats/review-stats.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { ReviewFormComponent } from './review-form/review-form.component';
import { Review, ReviewStats } from '../models/review.model';
import { ReviewService } from '../review.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-review-container',
  standalone: true,
  imports: [
    CommonModule,
    ReviewStatsComponent,
    ReviewListComponent,
    ReviewFormComponent
  ],
  template: `
    <div class="review-container">
      <h2>Customer Reviews</h2>
      <div *ngIf="isLoading" class="loading">Loading reviews...</div>
      
      <div *ngIf="!isLoading">
        <app-review-stats [stats]="reviewStats"></app-review-stats>
        
        <div class="review-actions">
          <button (click)="showForm = !showForm">
            {{showForm ? 'Cancel' : 'Write a Review'}}
          </button>
        </div>
        
        <app-review-form 
          *ngIf="showForm"
          [bookingOptionId]="bookingOptionId"
          [isEditing]="!!editingReview"
          [existingReview]="editingReview"
          (submitReview)="onReviewSubmit($event)">
        </app-review-form>
        
        <app-review-list [reviews]="reviews"></app-review-list>
      </div>
    </div>
  `,
  styles: [`
    .review-container {
      margin-top: 2rem;
    }
    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    .review-actions {
      margin: 1rem 0;
      text-align: right;
    }
    button {
      background: #0066cc;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ReviewContainerComponent {
  @Input() bookingOptionId!: string;
  reviews: Review[] = [];
  reviewStats: ReviewStats = {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
  };
  isLoading = true;
  showForm = false;
  editingReview?: Review;

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.isLoading = true;
    this.reviewService.getReviews(this.bookingOptionId).subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
        this.loadReviewStats();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadReviewStats() {
    this.reviewService.getReviewStats(this.bookingOptionId).subscribe({
      next: (stats: ReviewStats) => {
        this.reviewStats = stats;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onReviewSubmit(review: Review) {
    if (review.id) {
      this.reviewService.updateReview(review.id, review).subscribe({
        next: () => {
          this.loadReviews();
          this.showForm = false;
          this.editingReview = undefined;
        }
      });
    } else {
      this.reviewService.createReview(review).subscribe({
        next: () => {
          this.loadReviews();
          this.showForm = false;
        }
      });
    }
  }

  editReview(review: Review) {
    this.editingReview = review;
    this.showForm = true;
  }
}