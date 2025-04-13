import { Component, Input, OnInit } from '@angular/core';
import { BookingOptionsService } from '../booking-options.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface Review {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  language: string;
  status: string;
  createdAt: Date;
}

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  @Input() reviews: Review[] = [];
  filteredReviews$: Observable<Review[]> | null = null;
  loading = false;
  error: string | null = null;
  filterForm: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;

  constructor(
    private bookingService: BookingOptionsService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      language: [''],
      minRating: [0],
      sortBy: ['date']
    });
  }

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    this.loading = true;
    this.error = null;
    
    const params = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      ...this.filterForm.value
    };

    this.filteredReviews$ = this.bookingService.getReviews(params).pipe(
      map(response => {
        this.totalItems = response.total;
        return response.data;
      }),
      catchError(err => {
        this.error = 'Failed to load reviews. Please try again later.';
        return of([]);
      })
    );
    this.loading = false;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchReviews();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.fetchReviews();
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}
