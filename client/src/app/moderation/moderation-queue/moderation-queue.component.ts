import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService } from '../moderation.service';
import { Review } from '../../models/review.model';
import { ReviewListComponent } from '../../review/review-list/review-list.component';

@Component({
  selector: 'app-moderation-queue',
  standalone: true,
  imports: [CommonModule, ReviewListComponent],
  template: `
    <div class="moderation-queue">
      <h2>Review Moderation Queue</h2>
      <div *ngIf="isLoading" class="loading">Loading pending reviews...</div>
      <div *ngIf="!isLoading && reviews.length === 0" class="empty">
        No reviews pending moderation
      </div>
      <app-review-list [reviews]="reviews"></app-review-list>
    </div>
  `,
  styles: [`
    .moderation-queue {
      padding: 1rem;
    }
    .loading, .empty {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class ModerationQueueComponent {
  reviews: Review[] = [];
  isLoading = true;

  constructor(private moderationService: ModerationService) {}

  ngOnInit() {
    this.loadPendingReviews();
  }

  loadPendingReviews() {
    this.isLoading = true;
    this.moderationService.getPendingReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}