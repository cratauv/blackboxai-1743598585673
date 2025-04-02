import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../models/review.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  template: `
    <div class="review-list">
      <div *ngFor="let review of reviews" class="review-item">
        <div class="review-header">
          <div class="user-info">
            <div class="avatar">{{review.userName.charAt(0)}}</div>
            <div class="name-date">
              <span class="name">{{review.userName}}</span>
              <span class="date">{{review.createdAt | date:'mediumDate'}}</span>
            </div>
          </div>
          <app-star-rating [rating]="review.rating"></app-star-rating>
        </div>
        <h4 class="review-title">{{review.title}}</h4>
        <p class="review-comment">{{review.comment}}</p>
      </div>
    </div>
  `,
  styles: [`
    .review-list {
      margin-top: 2rem;
    }
    .review-item {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .user-info {
      display: flex;
      align-items: center;
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #0066cc;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.5rem;
    }
    .name-date {
      display: flex;
      flex-direction: column;
    }
    .name {
      font-weight: bold;
    }
    .date {
      font-size: 0.8rem;
      color: #666;
    }
    .review-title {
      margin: 0.5rem 0;
    }
    .review-comment {
      color: #333;
    }
  `]
})
export class ReviewListComponent {
  @Input() reviews: Review[] = [];
}