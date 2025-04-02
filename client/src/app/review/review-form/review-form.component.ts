import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  template: `
    <div class="review-form">
      <h3>Write a Review</h3>
      <div class="form-group">
        <label>Rating</label>
        <app-star-rating 
          [(rating)]="review.rating" 
          [interactive]="true">
        </app-star-rating>
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" [(ngModel)]="review.title" required>
      </div>
      <div class="form-group">
        <label>Your Review</label>
        <textarea [(ngModel)]="review.comment" required></textarea>
      </div>
      <button (click)="onSubmit()" [disabled]="!isFormValid()">
        {{isEditing ? 'Update' : 'Submit'}} Review
      </button>
    </div>
  `,
  styles: [`
    .review-form {
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 8px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    textarea {
      min-height: 100px;
    }
    button {
      background: #0066cc;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class ReviewFormComponent {
  @Input() bookingOptionId: string = '';
  @Input() isEditing: boolean = false;
  @Input() existingReview?: Review;
  @Output() submitReview = new EventEmitter<Review>();

  review: Omit<Review, 'id'|'createdAt'|'updatedAt'> = {
    bookingOptionId: '',
    userId: '',
    userName: '',
    rating: 0,
    title: '',
    comment: '',
    status: 'pending'
  };

  ngOnInit() {
    if (this.existingReview) {
      this.review = {
        bookingOptionId: this.existingReview.bookingOptionId,
        userId: this.existingReview.userId,
        userName: this.existingReview.userName,
        rating: this.existingReview.rating,
        title: this.existingReview.title,
        comment: this.existingReview.comment
      };
    } else {
      this.review.bookingOptionId = this.bookingOptionId;
      // TODO: Set user info from auth service
    }
  }

  isFormValid(): boolean {
    return this.review.rating > 0 && 
           this.review.title.trim().length > 0 && 
           this.review.comment.trim().length > 0;
  }

  onSubmit() {
    this.submitReview.emit({
      ...this.review,
      id: this.existingReview?.id || '',
      createdAt: this.existingReview?.createdAt || new Date(),
      updatedAt: new Date()
    });
  }
}