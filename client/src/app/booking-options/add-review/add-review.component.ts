import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-review',
  template: `
    <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="review-form">
      <div class="form-group">
        <label for="rating">Rating</label>
        <select id="rating" formControlName="rating" class="form-control">
          <option *ngFor="let num of [1,2,3,4,5]" [value]="num">{{num}}</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="comment">Comment</label>
        <textarea id="comment" formControlName="comment" class="form-control" rows="3"></textarea>
      </div>
      
      <div class="form-group">
        <label for="language">Language</label>
        <select id="language" formControlName="language" class="form-control">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
      </div>
      
      <button type="submit" class="btn btn-primary" [disabled]="!reviewForm.valid">
        Submit Review
      </button>
    </form>
  `,
  styles: [`
    .review-form {
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    .form-control {
      width: 100%;
      padding: 8px;
    }
  `]
})
export class AddReviewComponent {
  @Output() reviewSubmitted = new EventEmitter<any>();
  
  reviewForm = this.fb.group({
    rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(10)]],
    language: ['en', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    if (this.reviewForm.valid) {
      this.reviewSubmitted.emit(this.reviewForm.value);
      this.reviewForm.reset({
        rating: '',
        comment: '',
        language: 'en'
      });
    }
  }
}