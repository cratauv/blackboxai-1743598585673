import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating">
      <span *ngFor="let star of stars" 
            (click)="onRatingClick(star)"
            (mouseover)="onHover(star)"
            (mouseout)="onHoverOut()"
            [class.filled]="star <= currentRating"
            [class.interactive]="interactive">
        ★
      </span>
    </div>
  `,
  styles: [`
    .star-rating {
      font-size: 1.5rem;
      color: #ddd;
      display: inline-block;
    }
    .star-rating span {
      cursor: default;
    }
    .star-rating .filled {
      color: #ffc107;
    }
    .star-rating .interactive {
      cursor: pointer;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() interactive: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  currentRating = 0;
  hoverRating = 0;

  ngOnInit() {
    this.currentRating = this.rating;
  }

  ngOnChanges() {
    this.currentRating = this.rating;
  }

  onRatingClick(star: number) {
    if (this.interactive) {
      this.currentRating = star;
      this.ratingChange.emit(star);
    }
  }

  onHover(star: number) {
    if (this.interactive) {
      this.hoverRating = star;
    }
  }

  onHoverOut() {
    if (this.interactive) {
      this.hoverRating = 0;
    }
  }
}